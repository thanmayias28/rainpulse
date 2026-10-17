import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [suggestion, setSuggestion] = useState('')

  async function load() {
    const [d, s] = await Promise.all([
      axios.get(`${API_BASE}/api/sensordata`),
      axios.get(`${API_BASE}/api/suggestion`),
    ])
    setData(d.data)
    setSuggestion(s.data?.suggestion || '')
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 15000)
    return () => clearInterval(id)
  }, [])

  const chartData = [
    { name: 'Rain', value: data?.rain },
    { name: 'Moisture', value: data?.moisture },
    { name: 'Light', value: data?.light },
    { name: 'Temp', value: data?.temperature },
    { name: 'Humidity', value: data?.humidity },
  ].filter(d => d.value != null)

  return (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui', padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>RainPulse Dashboard</h1>
      <p style={{ color: '#555' }}>Live ThingSpeak feed → Smart suggestions</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Latest Readings</h2>
          {data ? (
            <ul style={{ lineHeight: 1.8 }}>
              <li>Rain: {data.rain ?? '—'}</li>
              <li>Moisture: {data.moisture ?? '—'}</li>

              <li>Time: {data.createdAt ?? '—'}</li>
            </ul>
          ) : (
            <div>Loading…</div>
          )}
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Suggestion</h2>
          <div style={{ background: '#f7fafc', padding: 12, borderRadius: 6 }}>{suggestion || '—'}</div>
        </div>
      </div>

      <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginTop: 16 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Reading Snapshot</h2>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}



