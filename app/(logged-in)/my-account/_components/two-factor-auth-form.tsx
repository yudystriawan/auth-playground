"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { toast } from "sonner";
import { disable2fa, enable2fa, generate2faSecret } from "../actions";

const TwoFactorAuthButton = (props: { twoFactorEnabled: boolean }) => {
  const router = useRouter();

  const { twoFactorEnabled } = props;
  const [step, setStep] = useState(1);
  const [secret, setSecret] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onEnable2fa = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const response = await generate2faSecret();

    setIsSubmitting(false);

    if (!response.success) {
      toast.error(response.message ?? "Something went wrong");
      return;
    }

    const secret = response.secret;
    if (secret) {
      setStep(2);
      setSecret(secret);
      toast.success("2FA Authentication enabled. Scan the QR code.");
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const response = await enable2fa({ otp });

    setIsSubmitting(false);

    if (!response.success) {
      toast.error(response.message ?? "Something went wrong");
      setOtp("");
      return;
    }

    toast.success("2FA Authentication activated successfully");
    setStep(1);
    setOtp("");
    router.refresh();
  };

  const onDisable2fa = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const response = await disable2fa();

    setIsSubmitting(false);

    if (!response.success) {
      toast.error(response.message ?? "Something went wrong");
      return;
    }

    toast.success("2FA Authentication disabled successfully");
    router.refresh();
  };

  return (
    <div>
      {twoFactorEnabled && (
        <Button
          className="w-full"
          variant="destructive"
          onClick={onDisable2fa}
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          Disable 2FA Authentication
        </Button>
      )}
      {!twoFactorEnabled && (
        <div>
          {step === 1 && (
            <Button
              className="w-full"
              onClick={onEnable2fa}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              Enable 2FA Authentication
            </Button>
          )}
          {step === 2 && (
            <div className="flex flex-col">
              <p className="text-xs text-muted-foreground pt-2">
                Scan the QR code below with your authenticator app
              </p>
              <QRCodeSVG value={secret} className="my-2" />
              <Button onClick={() => setStep(3)} className="w-full py-2">
                I Have scanned the QR code
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full py-2"
              >
                Cancel
              </Button>
            </div>
          )}
          {step === 3 && (
            <form className="flex flex-col gap-2" onSubmit={handleOTPSubmit}>
              <p className="text-xs">
                Please enter the one-time passcode from Authenticator App
              </p>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button type="submit" disabled={otp.length !== 6 || isSubmitting}>
                {isSubmitting && <Loader2Icon className="animate-spin" />}
                Submit
              </Button>
              <Button variant="outline" onClick={() => setStep(1)}>
                Cancel
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default TwoFactorAuthButton;
