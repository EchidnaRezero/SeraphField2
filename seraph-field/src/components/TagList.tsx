type TagListProps = {
  tags: string[];
};

export const TagList = ({ tags }: TagListProps) => (
  <ul className="tag-list" aria-label="태그">
    {tags.map((tag) => (
      <li key={tag}>{tag}</li>
    ))}
  </ul>
);
