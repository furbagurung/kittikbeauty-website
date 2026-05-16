import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { askProductMessage, buyNowMessage, createWhatsappLink } from "@/lib/whatsapp";

export function ProductDetailActions({ productName }: { productName: string }) {
  return (
    <div className="grid gap-3">
      <Button asChild className="h-[52px] w-full rounded-none bg-stone-950 px-7 text-sm font-bold text-white transition-colors duration-200 hover:bg-black">
        <Link href={createWhatsappLink(buyNowMessage(productName))} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="size-4" />
          Buy Now
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="h-12 w-full rounded-none border-stone-950 bg-white px-7 text-sm font-bold transition-colors duration-200 hover:bg-stone-950 hover:text-white"
      >
        <Link href={createWhatsappLink(askProductMessage(productName))} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="size-4" />
          Ask About This Product
        </Link>
      </Button>
    </div>
  );
}
