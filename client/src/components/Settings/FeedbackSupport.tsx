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

import React from "react";
import { X } from "lucide-react";

export default function Frame() {
  const feedbackData = {
    title: "What could we do better?",
    description: "We're sorry to hear you didn't like checkout! Please share what we can do to improve.",
    placeholder: "How can we improve?",
  };

  return (
    <div className="bg-transparent flex justify-center items-center w-full min-h-screen">
      <div className="w-full max-w-xl bg-white rounded-t-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{feedbackData.title}</h2>
            <p className="text-base text-gray-600">{feedbackData.description}</p>
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-800 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <textarea
            placeholder={feedbackData.placeholder}
            className="w-full min-h-[124px] border border-gray-300 rounded-xl p-3 text-[15px] text-gray-600 focus:ring-2 focus:ring-[#3949ab] outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center p-4">
          <button className="w-full max-w-md bg-[#3949ab] text-white font-semibold py-2 rounded-md hover:bg-[#303f9f] transition">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
