import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'

// Simple markdown renderer
function renderMarkdown(str = '') {
  return str
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
}

export default function Post() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPost()
  }, [id])

  const loadPost = async () => {
    try {
      const data = await api.blog.detail(id)
      setPost(data)
    } catch (error) {
      console.error('Error loading post:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: '820px' }}>
        <div className="muted">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container" style={{ maxWidth: '820px' }}>
        <div className="muted">Post not found.</div>
      </div>
    )
  }

  const contentHtml = `<p>${renderMarkdown(post.content || post.excerpt || '')}</p>`

  return (
    <div className="container" style={{ maxWidth: '820px' }}>
      <article className="card">
        <div className="pad">
          <h1>{post.title || 'Untitled'}</h1>
          <div className="muted">
            {new Date(post.createdAt || Date.now()).toDateString()}
          </div>
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </article>
    </div>
  )
}
