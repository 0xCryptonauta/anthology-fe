import { Seo } from "@components/Layout/Seo";

const headingStyle = {
  fontSize: "1.05rem",
  fontWeight: 600,
  marginBottom: "0.4rem",
  color: "#b45309",
};

const paragraphStyle = {
  fontSize: "0.95rem",
  lineHeight: 1.6,
  color: "#1a1a1a",
  marginBottom: "1.5rem",
};

export const AboutView = () => {
  return (
    <>
      <Seo title="About" description="Learn more about the Anthology project" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          padding: "2rem",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "640px",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.23)",
            backdropFilter: "blur(6px)",
            borderRadius: "12px",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              marginBottom: "1.5rem",
              textAlign: "center",
              color: "#1a1a1a",
            }}
          >
            Anthology
          </h1>

          <p style={paragraphStyle}>
            Anthology is a place to keep what you want to remember — notes,
            links, videos, ideas — organized into collections. We call each
            collection an <em>anthology</em>: like a book of your own writing,
            except it can hold anything.
          </p>

          <h2 style={headingStyle}>Yours, on your device</h2>
          <p style={paragraphStyle}>
            Everything you save lives in your browser. No account, no server,
            nobody else reading it. Close the tab, come back next week — it's
            all still there. It even works offline.
          </p>

          <h2 style={headingStyle}>Share it if you want</h2>
          <p style={paragraphStyle}>
            Every collection can be shared as a QR code. Scan it on another
            device and it's imported instantly — no links, no sign-ups, no
            middleman.
          </p>

          <h2 style={headingStyle}>Make it permanent (optional)</h2>
          <p style={paragraphStyle}>
            If you want a collection to outlive your browser — or be public for
            anyone to read — you can publish it to the blockchain (Arbitrum).
            Think of it as carving it into stone instead of writing it in a
            notebook. It costs a small network fee, and it's completely
            optional.
          </p>

          <h2 style={headingStyle}>Why "anthology"?</h2>
          <p style={{ ...paragraphStyle, marginBottom: 0 }}>
            An anthology is a collection of writing — poems, stories, songs.
            This one is your collection of whatever matters to you.
          </p>
        </div>
      </div>
    </>
  );
};
