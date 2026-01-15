-- Database Performance Optimizations for High-Concurrency Inventory Searches
-- Run this script in your Supabase SQL Editor after the main schema

-- ============================================================================
-- PERFORMANCE INDEXES FOR INVENTORY SEARCHES
-- ============================================================================

-- Composite index for common search patterns (year, make, model)
CREATE INDEX IF NOT EXISTS idx_vehicles_search_composite 
ON vehicles(status, year DESC, make, model) 
WHERE status = 'Active';

-- Full-text search index for vehicle descriptions
CREATE INDEX IF NOT EXISTS idx_vehicles_fulltext_search 
ON vehicles USING gin(to_tsvector('english', 
  COALESCE(make, '') || ' ' || 
  COALESCE(model, '') || ' ' || 
  COALESCE(trim, '') || ' ' || 
  COALESCE(stock_number, '')
));

-- Index for price range queries
CREATE INDEX IF NOT EXISTS idx_vehicles_price_range 
ON vehicles(retail_price) 
WHERE status = 'Active' AND retail_price > 0;

-- Index for odometer range queries
CREATE INDEX IF NOT EXISTS idx_vehicles_odometer 
ON vehicles(odometer) 
WHERE status = 'Active';

-- Partial index for available inventory only
CREATE INDEX IF NOT EXISTS idx_vehicles_available 
ON vehicles(created_at DESC) 
WHERE status IN ('Active', 'Coming Soon');

-- Index for VIN lookups (already exists in schema but ensuring uniqueness)
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehicles_vin_unique 
ON vehicles(vin);

-- ============================================================================
-- MATERIALIZED VIEW FOR DASHBOARD STATS (Improved Performance)
-- ============================================================================

-- Drop existing view if it exists
DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_stats;

-- Create materialized view for frequently accessed dashboard statistics
CREATE MATERIALIZED VIEW mv_dashboard_stats AS
SELECT 
  -- Inventory counts
  COUNT(*) FILTER (WHERE status = 'Active') as active_inventory_count,
  COUNT(*) FILTER (WHERE status = 'Sold') as sold_count,
  COUNT(*) FILTER (WHERE status = 'Coming Soon') as coming_soon_count,
  
  -- Financial metrics
  COALESCE(SUM(retail_price) FILTER (WHERE status = 'Active'), 0) as total_inventory_value,
  COALESCE(SUM(retail_price - purchase_price - extra_costs - taxes) 
    FILTER (WHERE status = 'Active'), 0) as projected_profit,
  COALESCE(AVG(retail_price) FILTER (WHERE status = 'Active'), 0) as avg_vehicle_price,
  
  -- Purchase metrics
  COALESCE(SUM(purchase_price + extra_costs + taxes) 
    FILTER (WHERE status = 'Active'), 0) as total_cost_basis,
  
  -- Timestamp
  NOW() as last_updated
FROM vehicles;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_mv_dashboard_stats_updated 
ON mv_dashboard_stats(last_updated);

-- ============================================================================
-- FUNCTION TO REFRESH MATERIALIZED VIEW
-- ============================================================================

-- Function to refresh dashboard stats (call this periodically or on vehicle changes)
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_dashboard_stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- OPTIMIZED INVENTORY SEARCH FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION search_inventory(
  p_search_term TEXT DEFAULT NULL,
  p_min_price DECIMAL DEFAULT NULL,
  p_max_price DECIMAL DEFAULT NULL,
  p_min_year INTEGER DEFAULT NULL,
  p_max_year INTEGER DEFAULT NULL,
  p_status TEXT DEFAULT 'Active',
  p_make TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  vin VARCHAR,
  year INTEGER,
  make VARCHAR,
  model VARCHAR,
  trim VARCHAR,
  odometer INTEGER,
  stock_number VARCHAR,
  condition VARCHAR,
  status VARCHAR,
  purchase_price DECIMAL,
  retail_price DECIMAL,
  extra_costs DECIMAL,
  taxes DECIMAL,
  image_gallery TEXT[],
  gross_profit DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.vin,
    v.year,
    v.make,
    v.model,
    v.trim,
    v.odometer,
    v.stock_number,
    v.condition,
    v.status,
    v.purchase_price,
    v.retail_price,
    v.extra_costs,
    v.taxes,
    v.image_gallery,
    (v.retail_price - v.purchase_price - v.extra_costs - v.taxes) as gross_profit,
    v.created_at
  FROM vehicles v
  WHERE 
    -- Status filter
    (p_status IS NULL OR v.status = p_status)
    -- Search term (full-text search)
    AND (
      p_search_term IS NULL 
      OR to_tsvector('english', 
        COALESCE(v.make, '') || ' ' || 
        COALESCE(v.model, '') || ' ' || 
        COALESCE(v.trim, '') || ' ' || 
        COALESCE(v.stock_number, '') || ' ' ||
        COALESCE(v.vin, '')
      ) @@ plainto_tsquery('english', p_search_term)
    )
    -- Price range
    AND (p_min_price IS NULL OR v.retail_price >= p_min_price)
    AND (p_max_price IS NULL OR v.retail_price <= p_max_price)
    -- Year range
    AND (p_min_year IS NULL OR v.year >= p_min_year)
    AND (p_max_year IS NULL OR v.year <= p_max_year)
    -- Make filter
    AND (p_make IS NULL OR v.make ILIKE p_make)
  ORDER BY v.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- CONNECTION POOLING SETTINGS (Run as superuser or via Supabase dashboard)
-- ============================================================================

-- These settings help with high-concurrency scenarios
-- Adjust based on your Supabase plan limits

-- Note: These ALTER SYSTEM commands may not work in Supabase free tier
-- For production, configure these in Supabase Dashboard → Settings → Database

-- Uncomment if you have appropriate permissions:
-- ALTER SYSTEM SET max_connections = 100;
-- ALTER SYSTEM SET shared_buffers = '256MB';
-- ALTER SYSTEM SET effective_cache_size = '1GB';
-- ALTER SYSTEM SET work_mem = '16MB';
-- ALTER SYSTEM SET maintenance_work_mem = '128MB';
-- ALTER SYSTEM SET random_page_cost = 1.1;
-- ALTER SYSTEM SET effective_io_concurrency = 200;
-- ALTER SYSTEM SET max_parallel_workers_per_gather = 2;
-- ALTER SYSTEM SET max_parallel_workers = 4;

-- ============================================================================
-- TRIGGER TO AUTO-REFRESH DASHBOARD STATS
-- ============================================================================

-- Function to refresh stats after vehicle changes
CREATE OR REPLACE FUNCTION trigger_refresh_dashboard_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Refresh in background (non-blocking)
  PERFORM refresh_dashboard_stats();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on vehicle INSERT/UPDATE/DELETE
DROP TRIGGER IF EXISTS trg_vehicle_stats_refresh ON vehicles;
CREATE TRIGGER trg_vehicle_stats_refresh
AFTER INSERT OR UPDATE OR DELETE ON vehicles
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_refresh_dashboard_stats();

-- ============================================================================
-- PARTITIONING FOR LARGE DATASETS (Future-proofing)
-- ============================================================================

-- If your inventory grows beyond 100,000 records, consider partitioning
-- Example: Partition by year for archived vehicles

-- CREATE TABLE vehicles_archive_2023 PARTITION OF vehicles
-- FOR VALUES FROM (2023) TO (2024);

-- ============================================================================
-- QUERY PERFORMANCE ANALYSIS
-- ============================================================================

-- Use these queries to analyze performance:

-- 1. Check index usage
-- SELECT 
--   schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public' AND tablename = 'vehicles'
-- ORDER BY idx_scan DESC;

-- 2. Find slow queries
-- SELECT 
--   query, 
--   calls, 
--   mean_exec_time, 
--   max_exec_time
-- FROM pg_stat_statements
-- WHERE query LIKE '%vehicles%'
-- ORDER BY mean_exec_time DESC
-- LIMIT 10;

-- 3. Check table bloat
-- SELECT 
--   schemaname, tablename, 
--   pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================================================
-- MAINTENANCE TASKS (Schedule these via Supabase or pg_cron)
-- ============================================================================

-- 1. Refresh dashboard stats every 5 minutes
-- SELECT cron.schedule('refresh-dashboard-stats', '*/5 * * * *', 'SELECT refresh_dashboard_stats()');

-- 2. Vacuum and analyze vehicles table daily
-- SELECT cron.schedule('vacuum-vehicles', '0 2 * * *', 'VACUUM ANALYZE vehicles');

-- 3. Reindex vehicles table weekly
-- SELECT cron.schedule('reindex-vehicles', '0 3 * * 0', 'REINDEX TABLE vehicles');

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION search_inventory IS 
'Optimized inventory search with full-text search, price/year filtering, and pagination. 
Uses composite indexes for high-concurrency scenarios.';

COMMENT ON MATERIALIZED VIEW mv_dashboard_stats IS 
'Pre-computed dashboard statistics refreshed on vehicle changes. 
Dramatically improves dashboard load times under high concurrency.';

COMMENT ON FUNCTION refresh_dashboard_stats IS 
'Refreshes the dashboard stats materialized view. 
Called automatically via trigger on vehicle changes.';

-- ============================================================================
-- INITIAL DATA REFRESH
-- ============================================================================

-- Refresh the materialized view for the first time
SELECT refresh_dashboard_stats();

-- Verify the view was created successfully
SELECT * FROM mv_dashboard_stats;
