import { defineStackbitConfig } from "@stackbit/types";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "custom",
  nodeVersion: "18",
  contentSources: [
    {
      name: "git",
      rootPath: ".",
      contentDirs: ["."],
      models: [
        {
          name: "page",
          type: "page",
          urlPath: "/{slug}",
          filePath: "{slug}.html",
          fields: [
            { name: "title", type: "string", required: true }
          ]
        }
      ]
    }
  ],
  siteMap: ({ documents }) => {
    return documents
      .filter((doc) => doc.modelName === "page")
      .map((doc) => {
        const slug = doc.id.replace(".html", "");
        return {
          document: doc,
          urlPath: slug === "index" ? "/" : "/" + slug,
        };
      });
  }
});
