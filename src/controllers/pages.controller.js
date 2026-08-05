import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '..', '..', 'public', 'pages');

export const renderPage = (page) => (req, res) => {
  const filePath = path.join(pagesDir, page + '.html');
  res.sendFile(filePath);
};