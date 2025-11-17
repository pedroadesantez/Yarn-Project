import { useState } from 'react'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    // In a real app, this would send to an API
  }

  return (
    <div className="container" style={{ maxWidth: '640px' }}>
      <h1>Contact us</h1>
      <form className="searchbar" style={{ flexDirection: 'column', gap: '12px' }} onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          className="input"
          placeholder="Message"
          style={{ minHeight: '120px' }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button className="btn" type="submit">Send</button>
        {submitted && (
          <div className="muted">Thanks! We will reply shortly.</div>
        )}
      </form>
    </div>
  )
}
