import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function Box(): JSX.Element {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="w-[1440px] h-[915px] bg-[url(/desktop-10.png)] bg-cover">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[716px] max-w-none">
          <DialogHeader>
            <div className="flex flex-col gap-1">
              <div className="text-sm text-zinc-500">Settings</div>
              <div className="text-base font-medium">Feedback & Support</div>
              <div className="text-xs text-zinc-400">
                Contact support or report an issue.
              </div>
            </div>
          </DialogHeader>

          <Card className="border-none shadow-none">
            <CardContent className="flex flex-col gap-4 p-0">
              <div className="space-y-2">
                <DialogTitle className="font-black text-xl tracking-[-0.40px] text-zinc-900">
                  What could we do better?
                </DialogTitle>
                <DialogDescription className="font-medium text-base text-zinc-600 tracking-[-0.40px]">
                  We're sorry to hear you didn't like checkout! Please share
                  what we can do to improve.
                </DialogDescription>
              </div>

              <Textarea
                placeholder="How can we improve?"
                className="min-h-[124px] text-[15px] font-medium text-zinc-400 tracking-[-0.40px] border-2 border-zinc-100"
              />
            </CardContent>
          </Card>

          <div className="flex justify-center w-full px-4">
            <Button className="w-full max-w-[375px] bg-[#3949ab] hover:bg-[#3949ab]/90 font-semibold">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
