"use server";

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signIn(email: string, password: string) {
  // Demo mode - accept any credentials
  const cookieStore = await cookies();
  
  // Store user email in cookie for demo
  cookieStore.set('demo_user_email', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signUp(email: string, password: string, fullName: string) {
  // Demo mode - accept any registration
  const cookieStore = await cookies();
  
  cookieStore.set('demo_user_email', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true, message: 'Account created successfully!' };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete('demo_user_email');

  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const email = cookieStore.get('demo_user_email')?.value;

  if (!email) {
    return null;
  }

  // Extract username from email (part before @)
  const username = email.split('@')[0];

  return {
    id: 'demo-user',
    email: email,
    fullName: username.charAt(0).toUpperCase() + username.slice(1), // Capitalize first letter
    avatar: undefined,
  };
}
