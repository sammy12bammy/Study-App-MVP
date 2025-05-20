'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export default function CreateSetButton() {
  const router = useRouter();

  const handleClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      router.push('/sets');
    } else {
      router.push('/login');
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleClick}>
      Create Set
    </button>
  );
}
