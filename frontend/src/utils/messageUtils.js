export function getId(val) {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (typeof val === "object" && typeof val._id === "string") return val._id;
  return null;
}

export function getMessageKey(msg) {
  const id = getId(msg?._id);
  if (id) return `id:${id}`;
  const sender = getId(msg?.sender) ?? "";
  const receiver = getId(msg?.receiver) ?? "";
  const createdAt = msg?.createdAt ?? msg?.updatedAt ?? "";
  const text = msg?.message ?? "";
  const image = msg?.image ?? "";
  return `c:${sender}|${receiver}|${createdAt}|${text}|${image}`;
}

export function appendUnique(prev, incoming) {
  const key = getMessageKey(incoming);
  if (!key) return prev;
  if (prev.some((m) => getMessageKey(m) === key)) return prev;
  return [...prev, incoming];
}
