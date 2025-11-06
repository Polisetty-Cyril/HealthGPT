import { motion } from "framer-motion";
import { History, MessageSquare, ImagePlus, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onSectionChange: (section: string) => void;
  activeSection: string;
}

const Sidebar = ({ onSectionChange, activeSection }: SidebarProps) => {
  const menuItems = [
    { id: "chat", label: "Ask Query", icon: MessageSquare },
    { id: "history", label: "History", icon: History },
    { id: "upload", label: "Upload Image", icon: ImagePlus },
    { id: "voice", label: "Voice Input", icon: Mic },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-white border-r border-border p-4 min-h-screen"
    >
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Button
              variant={activeSection === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeSection === item.id
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
