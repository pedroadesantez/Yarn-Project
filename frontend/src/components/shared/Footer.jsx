export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer>
      <div className="container">
        <p>&copy; {currentYear} Yarnly. All rights reserved.</p>
      </div>
    </footer>
  )
}
