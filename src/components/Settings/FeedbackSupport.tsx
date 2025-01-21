// import { Button } from "../ui/Button";
// import { Card, CardContent } from "../ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/Dialog";
// import { Textarea } from "../ui/Textarea";
// import React from "react";

// export default function Feedback(){
//   const [open, setOpen] = React.useState(true);

//   return (
    
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="w-[716px] max-w-none">
//           <DialogHeader>
//             <div className="flex flex-col gap-1">
//               <div className="text-sm text-zinc-500">Settings</div>
//               <div className="text-base font-medium">Feedback & Support</div>
//               <div className="text-xs text-zinc-400">
//                 Contact support or report an issue.
//               </div>
//             </div>
//           </DialogHeader>

//           <Card className="border-none shadow-none">
//             <CardContent className="flex flex-col gap-4 p-0">
//               <div className="space-y-2">
//                 <DialogTitle className="font-black text-xl tracking-[-0.40px] text-zinc-900">
//                   What could we do better?
//                 </DialogTitle>
//                 <DialogDescription className="font-medium text-base text-zinc-600 tracking-[-0.40px]">
//                   We're sorry to hear you didn't like checkout! Please share
//                   what we can do to improve.
//                 </DialogDescription>
//               </div>

//               <Textarea
//                 placeholder="How can we improve?"
//                 className="min-h-[124px] text-[15px] font-medium text-zinc-400 tracking-[-0.40px] border-2 border-zinc-100"
//               />
//             </CardContent>
//           </Card>

//           <div className="flex justify-center w-full px-4">
//             <Button className="w-full max-w-[375px] bg-[#3949ab] hover:bg-[#3949ab]/90 font-semibold" onClick={() => setOpen(false)}>
//               Submit
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//   );
// }
import Button from '@mui/material/Button'; 
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import { X } from "lucide-react";
import React from "react";

export default function Frame(){
  const feedbackData = {
    title: "What could we do better?",
    description: "We're sorry to hear you didn't like checkout! Please share what we can do to improve.",
    placeholder: "How can we improve?",
  };

  return (
    <div className="bg-transparent flex flex-row justify-center w-full min-h-screen">
      <div className="w-full h-screen">
        <div className="h-screen flex items-center justify-center">
          <Card className="w-[716px] bg-white rounded-t-[16px] rounded-b-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between p-5 border-b">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">
                  {feedbackData.title}
                </h2>
                <p className="text-base font-medium text-gray-600">
                  {feedbackData.description}
                </p>
              </div>
              <Button variant="text" size="small" className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <TextField
                placeholder={feedbackData.placeholder}
                className="min-h-[124px] resize-none border-2 border-gray-100 rounded-xl p-3 text-[15px] font-medium text-gray-400"
              />
            </CardContent>
            <div className="flex justify-center p-4 ">
              <Button className="w-[375px] bg-[#3949ab] text-white font-semibold">
                Submit
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}