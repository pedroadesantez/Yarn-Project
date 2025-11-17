import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await api.blog.list()
      setPosts(data.items || [])
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Blog</h1>
      {loading ? (
        <div className="muted">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="muted">No posts yet.</div>
      ) : (
        <div className="grid">
          {posts.map(post => (
            <article key={post.id} className="card">
              <div className="pad">
                <div className="muted">
                  {new Date(post.createdAt || Date.now()).toDateString()}
                </div>
                <h3>{post.title || 'Untitled'}</h3>
                <p className="muted">{post.excerpt || ''}</p>
                <div style={{ marginTop: '8px' }}>
                  <Link className="btn-ghost" to={`/blog/${post.id}`}>
                    Read more
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
