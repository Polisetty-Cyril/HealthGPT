import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import medicalBg from "@/assets/medical-bg.jpg";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${medicalBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-primary/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          >
            Medical RAG Output Grading
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6 mb-12 text-lg text-foreground/80"
          >
            <p className="leading-relaxed">
              This platform uses AI to provide <span className="font-semibold text-primary">reliable, well-structured, and medically accurate answers</span> to user queries. Our advanced system ensures every response meets the highest standards of medical information delivery.
            </p>

            <p className="leading-relaxed">
              It leverages <span className="font-semibold text-primary">Retrieval-Augmented Generation (RAG) models</span> to combine comprehensive medical knowledge with cutting-edge AI reasoning, delivering insights you can trust.
            </p>

            <p className="leading-relaxed">
              The system focuses on <span className="font-semibold text-primary">clear explanations, trusted references, and safe medical information delivery</span> — ensuring accuracy and reliability without exposing internal grading scores.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="group text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
            >
              Get Started
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 py-6 text-center text-sm text-muted-foreground"
      >
        © 2025 Medical RAG Output Grading
      </motion.footer>
    </div>
  );
};

export default About;
