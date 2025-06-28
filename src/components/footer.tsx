export default function Footer() {
  return (
        <footer className="bg-slate-900 ">
          <div className="border-t border-slate-800 mt-2 pb-2 pt-2 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} GenCV. All rights reserved.</p>
          </div>
        </footer>
  );
}
