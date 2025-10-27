import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase/firebase";
import { useRouter } from 'next/navigation';

import axios from "axios";
import { Button } from "@/components/ui/button";


export default function OAuth() {
  const auth = getAuth(app);
  const router = useRouter();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await axios.post("/auth/oauth", {
        email: resultsFromGoogle.user.email,
      });

      if (res.status === 200) {
        localStorage.setItem(
          "innoreigniters_credentials",
          JSON.stringify(res.data)
        );
        
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button variant="outline" className="w-full " onClick={handleGoogleClick}>
      Login with Google
    </Button>
  );
}
