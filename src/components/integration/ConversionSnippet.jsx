import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Code } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ConversionSnippet({ companyId }) {
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState('generic');

  const snippets = {
    generic: `<!-- StakeShare Conversion Tracking -->
<script>
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref') || localStorage.getItem('stakeshare_ref');
  if (refCode) {
    fetch('https://api.stakeshare.app/track/conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referralCode: refCode,
        customerEmail: 'REPLACE_WITH_CUSTOMER_EMAIL',
        revenueAmount: 0, // In dollars
        companyId: '${companyId}',
      })
    });
  }
})();
</script>`,
    shopify: `<!-- StakeShare Conversion Tracking for Shopify -->
<!-- Paste in Settings > Checkout > Order status page > Additional scripts -->
<script>
(function() {
  const refCode = localStorage.getItem('stakeshare_ref');
  if (refCode && typeof checkout !== 'undefined') {
    fetch('https://api.stakeshare.app/track/conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referralCode: refCode,
        customerEmail: {{ checkout.email | json }},
        revenueAmount: {{ checkout.total_price | money_without_currency }},
        companyId: '${companyId}',
      })
    });
  }
})();
</script>`
  };
  
  const copySnippet = () => {
    navigator.clipboard.writeText(snippets[platform]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Tabs value={platform} onValueChange={setPlatform} className="w-full">
        <TabsList className="grid w-full grid-cols-2 glass">
          <TabsTrigger value="generic">Generic / Custom</TabsTrigger>
          <TabsTrigger value="shopify">Shopify</TabsTrigger>
        </TabsList>
        <div className="flex items-center justify-between mt-4">
            <h4 className="font-semibold text-white">Platform-Specific Code</h4>
            <Button
              onClick={copySnippet}
              size="sm"
              variant="outline"
              className="glass border-white/20 text-white hover:bg-white/10"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
        </div>
        <TabsContent value="generic">
          <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm overflow-x-auto mt-2">
            <pre className="text-green-300">{snippets.generic}</pre>
          </div>
          <p className="text-white/70 text-sm mt-2">Replace placeholders with variables from your system.</p>
        </TabsContent>
        <TabsContent value="shopify">
          <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm overflow-x-auto mt-2">
            <pre className="text-green-300">{snippets.shopify}</pre>
          </div>
          <p className="text-white/70 text-sm mt-2">No editing needed! Paste this directly into your Shopify order status page scripts.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}