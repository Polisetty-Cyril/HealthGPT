import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-muted">
        <span className="text-xl">🤖</span>
      </div>

      <div className="max-w-[70%] rounded-2xl rounded-tl-none px-4 py-3 bg-muted">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
