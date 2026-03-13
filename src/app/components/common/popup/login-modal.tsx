"use client";
import React, { useRef } from "react";
import Link from "next/link";
import LoginForm from "../../forms/login-form";

const LoginModal = () => {
  return (
    <div className="modal fade" id="loginModal" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ maxWidth: 480, margin: "0 auto" }}>
          <button
            type="button"
            className="btn-close position-absolute"
            style={{ top: 16, right: 20, zIndex: 1 }}
            data-bs-dismiss="modal"
            aria-label="Close"
          />
          <div className="modal-body p-4">
            <div className="text-center mb-4">
              <h4 style={{ color: "#fff", marginBottom: 6 }}>Welcome Back</h4>
              <p style={{ color: "rgba(226,232,240,0.6)", fontSize: 14 }}>
                Sign in to your account
              </p>
            </div>
            <LoginForm />
            <p className="text-center mt-3" style={{ fontSize: 14, color: "rgba(226,232,240,0.6)" }}>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="fw-500" data-bs-dismiss="modal" style={{ color: "#60A5FA" }}>
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
