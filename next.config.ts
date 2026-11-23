import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  async headers(){
    return [{source:"/p/:token",headers:[
      {key:"Referrer-Policy",value:"no-referrer"},
      {key:"X-Robots-Tag",value:"noindex, nofollow, noarchive"},
      {key:"Cache-Control",value:"private, no-store"}
    ]}];
  }
};

export default nextConfig;
