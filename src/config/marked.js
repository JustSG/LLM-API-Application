import { marked } from "marked";

marked.use({
  gfm: true,
  breaks: true,
  pedantic: false,
});