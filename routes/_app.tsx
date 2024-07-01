import { defineApp, type PageProps } from "$fresh/server.ts";
import Footer from "../components/footer.tsx";
export default defineApp((_, { Component }: PageProps) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>家铭的个人网站</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-[#86efac] dark:bg-gray-950 text-lime-500 h-screen">
        <section class="content p-8">
          <Component></Component>
        </section>
        <Footer></Footer>
      </body>
    </html>
  );
});
