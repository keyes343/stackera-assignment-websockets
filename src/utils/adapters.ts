export const adapter_savedSearchCategory_to_entityType = (
  savedSearchCategory: "savedSearches_links" | "savedSearches_notes" | "savedSearches_todos",
) => {
  switch (savedSearchCategory) {
    case "savedSearches_links":
      return "hyperlink";
    case "savedSearches_notes":
      return "note";
    case "savedSearches_todos":
      return "todo";
    default:
      throw Error("wrong category passed");
  }
};

export const adapter_entityType_to_savedSearchCategory = (entity_type: "hyperlink" | "note" | "todo") => {
  switch (entity_type) {
    case "hyperlink":
      return "savedSearches_links";
    case "note":
      return "savedSearches_notes";
    case "todo":
      return "savedSearches_todos";
    default:
      return "savedSearches_todos";
    // throw Error("wrong entity type passed");
  }
};
