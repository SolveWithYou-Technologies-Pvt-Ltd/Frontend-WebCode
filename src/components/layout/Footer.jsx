import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

const footerLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Our Services", path: "/services" },
  { label: "Careers", path: "/careers" },
];

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="md:col-span-2 lg:col-span-1">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="inline-block h-10 min-w-10">
              <img src={Logo} alt="Logo" className="h-full w-auto object-contain object-left" />
            </span>
            <span className="text-base font-bold text-white">SolveWithYou Pvt Ltd</span>
          </Link>

          <p className="mt-4 max-w-sm text-xs leading-6 text-slate-400 sm:text-sm">
            Delivering cutting-edge software solutions, custom mobile applications, 
            and scalable web development to drive your business forward.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Quick Links</h3>
          <div className="mt-4 grid gap-2.5">
            {footerLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="w-fit text-xs text-slate-400 transition hover:text-white sm:text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Contact</h3>
          <div className="mt-4 grid gap-3 text-xs text-slate-400 sm:text-sm">
            <p className="flex items-start gap-2.5">
              <Phone size={16} className="mt-0.5 shrink-0 text-teal-400" />
              +91 90058 25347 , +91 99363 44869
            </p>
            <p className="flex items-start gap-2.5">
              <MessageCircle size={16} className="mt-0.5 shrink-0 text-teal-400" />
              +91 95198 39502
            </p>
            <p className="flex items-start gap-2.5">
              <Mail size={16} className="mt-0.5 shrink-0 text-teal-400" />
              solvewithyou@gmail.com
            </p>
            <p className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-teal-400" />
              Lucknow, Uttar Pradesh
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Working Hours</h3>
          <div className="mt-4 flex items-start gap-2.5 text-xs text-slate-400 sm:text-sm">
            <Clock3 size={16} className="mt-0.5 shrink-0 text-teal-400" />
            <div>
              <p>Monday - Friday</p>
              <p className="mt-1">09:00 AM - 06:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-xs lg:px-8">
          <p>
            © {new Date().getFullYear()} SolveWithYou Pvt Ltd. All rights reserved.
          </p>
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-3">
            <Link to="/privacy" className="transition hover:text-teal-400">
              Privacy Policy
            </Link>
            <span className="hidden sm:block">|</span>
            <Link to="/terms" className="transition hover:text-teal-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;