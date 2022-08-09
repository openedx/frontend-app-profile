import React from "react";
import logo from "../assets/logo.svg";
import openCraftLogo from "../assets/opencraft-logo.png";
import openEdxLogo from "../assets/open-edx-logo-tag.png";
import "./Footer.scss";
import { getConfig } from "@edx/frontend-platform";

const Footer = () => {
  const Footerlinks = [
    {
      text: "What we do",
      href: `${getConfig().LMS_BASE_URL}/about`,
    },
    {
      text: "Donate",
      href: `${getConfig().LMS_BASE_URL}/donate`,
    },
    {
      text: "Help",
      href: `${getConfig().LMS_BASE_URL}/help`,
    },
    {
      text: "Contact",
      href: `${getConfig().LMS_BASE_URL}/contact`,
    },
    {
      text: "Honor code",
      href: `${getConfig().LMS_BASE_URL}/honor`,
    },
  ];

  return (
    <footer className="container"> 
      <div className="footer-container">
        <div className="colophon">
          <ul className="nav-colophon">
            {Footerlinks.map((data, index) => (
              <li key={data.text}>
                <a href={data.href}>{data.text}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="privacy-items">
          <div className="flex icons space-x-6">
            <a href="/" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg
                className="h-6 w-6"
                fill="#000"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a href="/" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg
                className="h-6 w-6"
                fill="#000"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <a href="/" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only"> Linkedin </span>
              <svg
                viewBox="0 50 512 512"
                className="h-6 w-6"
                fill="#000"
                aria-hidden="true"
              >
                <path
                  fill="#000"
                  d="M150.65,100.682c0,27.992-22.508,50.683-50.273,50.683c-27.765,0-50.273-22.691-50.273-50.683 C50.104,72.691,72.612,50,100.377,50C128.143,50,150.65,72.691,150.65,100.682z M143.294,187.333H58.277V462h85.017V187.333z M279.195,187.333h-81.541V462h81.541c0,0,0-101.877,0-144.181c0-38.624,17.779-61.615,51.807-61.615 c31.268,0,46.289,22.071,46.289,61.615c0,39.545,0,144.181,0,144.181h84.605c0,0,0-100.344,0-173.915 s-41.689-109.131-99.934-109.131s-82.768,45.369-82.768,45.369V187.333z"
                ></path>
              </svg>
            </a>
            <a href="/" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only"> Medium </span>
              <svg
                viewBox="0 0 1043.63 592.71"
                className="h-6 w-6"
                fill="#000"
                aria-hidden="true"
              >
                <g data-name="Layer 2">
                  <g data-name="Layer 1">
                    <path
                      fill="#000"
                      d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.16-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.91-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94"
                    ></path>
                  </g>
                </g>
              </svg>
            </a>
          </div>
          <div className="privacy-links">
            <ul className="Name-All-rights">
              <li>
                <a href="/name">© Name</a>
              </li>
              <li>
                <a href="/all-rights">All rights reserved</a>
              </li>
              <li>
                <a href={`${getConfig().LMS_BASE_URL}/privacy`}>Privacy</a>
              </li>
              <li>
                <a href={`${getConfig().LMS_BASE_URL}/tos`}>Terms</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="Line"></div>
      <div className="logos-section">
        <div className="left-section">
          <div className="partnership-logos">
            <img alt="abstract-logo" src={logo} />
            <img alt="opencraft-logo" src={openCraftLogo} />
          </div>
          <span className="Theme-licensed-under">
            Theme licensed under the AGPLv3 License.
            <br />
            Copyright {new Date().getFullYear()} by OpenCraft & Abstract
            Technology
          </span>
        </div>
        <div className="right-section">
          <img alt="openedx-logo" src={openEdxLogo} />
          <span className="edX-Open-edX-and-th">
            edX, Open edX and their respective logos are registered trademarks
            of edX Inc. Free online courses at{" "}
            <a href="https://www.edx.org">edX.org</a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
