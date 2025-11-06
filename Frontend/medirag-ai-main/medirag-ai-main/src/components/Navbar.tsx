import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-border shadow-sm px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Medical RAG
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
            <User className="h-5 w-5 mr-2" />
            Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-destructive/10 hover:text-destructive"
            onClick={() => navigate("/login")}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
