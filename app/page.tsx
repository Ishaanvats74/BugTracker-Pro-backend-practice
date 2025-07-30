'use client'
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


export default function Home() {
  const {isSignedIn,user} = useUser();
  const router = useRouter();
  if (!isSignedIn){
    router.push('/sign-in')
  }
  console.log(user)
  const userEmail = user?.emailAddresses[0]?.emailAddress;


  return (
  <div>
    {userEmail}
    
  </div>
  );
}
