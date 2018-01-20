export default function getWidth(elem) {
  return (elem && (elem.getBoundingClientRect().width || elem.offsetWidth)) || 0
}
