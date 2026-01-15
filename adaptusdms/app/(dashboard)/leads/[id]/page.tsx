'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Phone, Mail } from 'lucide-react';
import { useLeads } from '@/hooks/use-leads';
import { sendLeadSms } from '@/lib/actions/send-sms';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

function getSupabase() {
  return createClient();
}

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;
  const { data: leads } = useLeads();
  const lead = leads?.find(l => l.id === leadId);
  const queryClient = useQueryClient();
  
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Fetch interactions
  const { data: interactions } = useQuery({
    queryKey: ['interactions', leadId],
    queryFn: async () => {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('interactions')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!leadId,
  });

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !leadId) return;

    setSending(true);
    try {
      await sendLeadSms(leadId, message);
      toast.success('SMS sent successfully');
      setMessage('');
      // Refetch interactions
      queryClient.invalidateQueries({ queryKey: ['interactions', leadId] });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send SMS');
    } finally {
      setSending(false);
    }
  };

  if (!lead) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-slate-500">Lead not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{lead.customer?.name || 'Lead Details'}</h1>
        <p className="text-slate-500 mt-1">Lead ID: {lead.id}</p>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="font-medium">{lead.customer?.name || 'No customer linked'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {lead.customer?.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {lead.customer?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <Badge className="capitalize">
                    {lead.status?.replace('_', ' ') || 'Not Started'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Source</p>
                  <p className="font-medium capitalize">{lead.source}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Created</p>
                  <p className="font-medium">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>SMS Conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {interactions && interactions.length > 0 ? (
                  interactions.map((interaction: any) => (
                    <div
                      key={interaction.id}
                      className={`flex ${interaction.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          interaction.direction === 'outbound'
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{interaction.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(interaction.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendSms} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sending}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={sending || !message.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Messages will be sent via SMS to {lead.customer?.phone || 'N/A'}
                </p>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
