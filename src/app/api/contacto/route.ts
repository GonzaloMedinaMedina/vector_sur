import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { nombre, email, asunto, mensaje } = await req.json()

  if (!nombre || !email || !asunto || !mensaje) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Vector Sur Web" <${process.env.SMTP_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `[Vector Sur] ${asunto} — ${nombre}`,
    html: `
      <div style="font-family:monospace;background:#050508;color:#e0e0e0;padding:32px;max-width:600px">
        <h2 style="color:#00ff41;font-size:18px;margin-bottom:24px">Nuevo mensaje — Vector Sur</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="color:#666;padding:6px 0;width:100px">Nombre:</td><td style="color:#e0e0e0">${nombre}</td></tr>
          <tr><td style="color:#666;padding:6px 0">Email:</td><td><a href="mailto:${email}" style="color:#00ff41">${email}</a></td></tr>
          <tr><td style="color:#666;padding:6px 0">Asunto:</td><td style="color:#e0e0e0">${asunto}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #00ff4133;margin:20px 0"/>
        <p style="color:#aaa;white-space:pre-wrap;line-height:1.7">${mensaje}</p>
        <hr style="border:none;border-top:1px solid #00ff4133;margin:20px 0"/>
        <p style="color:#444;font-size:11px">Enviado desde vectorsur.es</p>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
