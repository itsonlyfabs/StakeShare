
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Copy, Facebook, MessageSquare as Whatsapp } from 'lucide-react';

export default function ShareDialog({ isOpen, onOpenChange, programName, programDescription, pageUrl }) {

    const shareText = `Check out the "${programName}" micro-investor program on StakeShare!`;
    const encodedShareText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(pageUrl);

    const shareOptions = [
        {
            name: "Twitter",
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedShareText}`,
            className: "text-sky-400 bg-sky-900/20 hover:bg-sky-900/40"
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodeURIComponent(programName)}&summary=${encodedShareText}`,
            className: "text-blue-500 bg-blue-900/20 hover:bg-blue-900/40"
        },
        {
            name: "Facebook",
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            className: "text-blue-600 bg-blue-900/20 hover:bg-blue-900/40"
        },
        {
            name: "WhatsApp",
            icon: Whatsapp,
            url: `https://api.whatsapp.com/send?text=${encodedShareText}%20${encodedUrl}`,
            className: "text-green-500 bg-green-900/20 hover:bg-green-900/40"
        }
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(pageUrl);
        alert('Link copied to clipboard!');
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="glass-card text-white border-slate-700">
                <DialogHeader>
                    <DialogTitle>Share this program</DialogTitle>
                    <DialogDescription className="text-white/70">
                        Spread the word and help founders find amazing micro-investors.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                    {shareOptions.map((option) => (
                        <a 
                            key={option.name}
                            href={option.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg text-white transition-all duration-200 ${option.className}`}
                        >
                            <option.icon className="w-6 h-6" />
                            <span>{option.name}</span>
                        </a>
                    ))}
                </div>
                <div className="flex items-center space-x-2">
                    <input 
                        readOnly 
                        value={pageUrl} 
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm"
                    />
                    <Button onClick={handleCopy} variant="ghost" size="icon" className="hover:bg-slate-700">
                        <Copy className="w-4 h-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
