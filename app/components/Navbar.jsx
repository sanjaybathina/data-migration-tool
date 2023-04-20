import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  return (
    <nav className="w-100navbar bg-transparent text-white border-bottom border-white p-3 py-3 px-5">
      <div className="d-flex justify-content-between m-0">
          <div className="col-4">
            <span className="navbar-brand text-white fw-light mb-0 h1">
              Migration Tool
            </span>
          </div>
          <div className="col-auto">
            <Link href="/" className="text-decoration-none text-white me-3 border-white border-bottom">Hosts</Link>
            <Link href="/migrations" className="text-decoration-none text-white me-3 border-white border-bottom">Migrations</Link>
          </div>
        </div>
    </nav>
  );
}
