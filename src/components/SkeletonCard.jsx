export default function SkeletonCard() {
  return (
    <div className="pcard skeleton">
      <div className="pcard-media sk-box" />
      <div className="pcard-body">
        <div className="sk-line sk-w40" />
        <div className="sk-line sk-w90" />
        <div className="sk-line sk-w70" />
        <div className="sk-line sk-w50" />
        <div className="sk-btn" />
      </div>
    </div>
  )
}
