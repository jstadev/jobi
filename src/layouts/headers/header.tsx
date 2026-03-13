"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Menus from "./component/menus";
import logo from "@/assets/images/logo/logo_01.png";
import CategoryDropdown from "./component/category-dropdown";
import LoginModal from "@/app/components/common/popup/login-modal";
import useSticky from "@/hooks/use-sticky";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const { sticky } = useSticky();
  const { user, profile, logout } = useAuth();

  return (
    <>
      <header className={`theme-main-menu menu-overlay menu-style-one sticky-menu ${sticky ? "fixed" : ""}`}>
        <div className="inner-content position-relative">
          <div className="top-header">
            <div className="d-flex align-items-center">
              <div className="logo order-lg-0">
                <Link href="/" className="d-flex align-items-center">
                  <Image src={logo} alt="logo" priority />
                </Link>
              </div>

              <div className="right-widget ms-auto order-lg-3">
                <ul className="d-flex align-items-center style-none gap-2">
                  {user ? (
                    <>
                      <li className="d-none d-md-block">
                        <Link
                          href={profile?.role === "employer" ? "/dashboard/employ-dashboard" : "/dashboard/candidate-dashboard"}
                          className="job-post-btn tran3s"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={logout}
                          className="login-btn-one"
                          style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 20px", cursor: "pointer", color: "rgba(226,232,240,0.7)" }}
                        >
                          Logout
                        </button>
                      </li>
                      {profile?.role === "employer" && (
                        <li className="d-none d-md-block ms-2">
                          <Link href="/dashboard/employ-dashboard/submit-job" className="btn-one">
                            Post a Job
                          </Link>
                        </li>
                      )}
                    </>
                  ) : (
                    <>
                      <li className="d-none d-md-block">
                        <Link href="/register" className="job-post-btn tran3s">
                          Post Job
                        </Link>
                      </li>
                      <li>
                        <a href="#" className="login-btn-one" data-bs-toggle="modal" data-bs-target="#loginModal">
                          Login
                        </a>
                      </li>
                      <li className="d-none d-md-block ms-2">
                        <Link href="/register" className="btn-one">
                          Sign Up Free
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <nav className="navbar navbar-expand-lg p0 ms-lg-5 ms-3 order-lg-2">
                <button
                  className="navbar-toggler d-block d-lg-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav align-items-lg-center">
                    <li className="d-block d-lg-none">
                      <div className="logo">
                        <Link href="/" className="d-block">
                          <Image src={logo} alt="logo" width={100} priority />
                        </Link>
                      </div>
                    </li>
                    <li className="nav-item dropdown category-btn mega-dropdown-sm">
                      <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                        <i className="bi bi-grid-fill"></i> Category
                      </a>
                      <CategoryDropdown />
                    </li>
                    <Menus />
                    <li className="d-md-none">
                      <Link href="/register" className="job-post-btn tran3s">Post Job</Link>
                    </li>
                    <li className="d-md-none">
                      <Link href="/job-grid-v3" className="btn-one w-100">Browse Jobs</Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <LoginModal />
    </>
  );
};

export default Header;
