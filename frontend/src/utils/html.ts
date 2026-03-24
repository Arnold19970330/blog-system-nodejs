export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

export const isRichTextEmpty = (html: string): boolean => {
  return stripHtmlTags(html).length === 0;
};
