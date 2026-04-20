import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendRequestEmail(to: string, data: { name: string, amount: number, description: string }) {
  const mailOptions = {
    from: `"Transaksiku Notif" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: `Permintaan Dana: ${data.description}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2ec4b6;">Halo, Ada Permintaan Dana!</h2>
        <p><strong>${data.name}</strong> meminta dana untuk keperluan berikut:</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
          <p style="margin: 0;"><strong>Nominal:</strong> Rp ${data.amount.toLocaleString("id-ID")}</p>
          <p style="margin: 5px 0 0 0;"><strong>Keterangan:</strong> ${data.description}</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #888;">
          Email ini dikirim otomatis oleh sistem Transaksiku.
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}