import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: "center",
      padding: "24px",
      fontSize: "0.85rem",
      color: "var(--text-light, #e7e7e7)",
      borderTop: "1px solid rgba(255, 134, 134, 0.05)",
      marginTop: "auto",
      backgroundColor: "var(--ivory, #000000)"
    }}>
      &copy; {new Date().getFullYear()} GrandFort Catering. All rights reserved.
    </footer>
  );
};

export default Footer;
