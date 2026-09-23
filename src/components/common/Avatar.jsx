export default function Avatar({ src, name = "User", size = "md" }) {
  return src ? (
    <img className={`avatar avatar-${size}`} src={src} alt={name} />
  ) : (
    <div className={`avatar avatar-${size} avatar-fallback`}>{name[0]}</div>
  );
}
