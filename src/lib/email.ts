import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// A teszt domain (amíg nincs saját domained)
const FROM_EMAIL = "onboarding@resend.dev";
const APP_NAME = "Webshop";
const APP_URL = process.env.AUTH_URL || "http://localhost:3000";

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: "Erősítsd meg az email címed",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; }
          .content { background: #f9fafb; padding: 30px; border-radius: 8px; }
          .button { display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🛍️ ${APP_NAME}</div>
          </div>
          <div class="content">
            <h2>Kedves ${name || "Vásárló"}!</h2>
            <p>Köszönjük, hogy regisztráltál a ${APP_NAME} webáruházba!</p>
            <p>Kérjük, erősítsd meg az email címed az alábbi gombra kattintva:</p>
            <p style="text-align: center;">
              <a href="${verifyUrl}" class="button">Email megerősítése</a>
            </p>
            <p style="font-size: 14px; color: #6b7280;">
              Ha a gomb nem működik, másold be ezt a linket a böngésződbe:<br>
              <a href="${verifyUrl}" style="color: #000; word-break: break-all;">${verifyUrl}</a>
            </p>
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              A link <strong>24 óráig</strong> érvényes. Ha nem te regisztráltál, hagyd figyelmen kívül ezt az emailt.
            </p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} ${APP_NAME}. Minden jog fenntartva.
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error("❌ Email küldési hiba:", error);
    throw new Error("Nem sikerült elküldeni az emailt");
  }

  return data;
}

export async function sendWelcomeEmail(email: string, name: string) {
  const { data, error } = await resend.emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: "Sikeres regisztráció! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="text-align: center;">🛍️ ${APP_NAME}</h1>
          <div style="background: #f9fafb; padding: 30px; border-radius: 8px;">
            <h2>Kedves ${name || "Vásárló"}!</h2>
            <p>Sikeresen megerősítetted az email címed. Most már be tudsz jelentkezni és vásárolhatsz!</p>
            <p style="text-align: center; margin-top: 30px;">
              <a href="${APP_URL}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Vásárlás megkezdése
              </a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error("❌ Welcome email hiba:", error);
  }

  return data;
}