import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Github, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! I'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section id="contact" className="section-padding relative" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">Contact</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Let's Build <span className="gradient-text">Together</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Have a project idea or just want to connect? I'd love to hear from you.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-2xl p-8 md:p-10 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Name</label>
              <input
                required
                type="text"
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Email</label>
              <input
                required
                type="email"
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Message</label>
            <textarea
              required
              rows={5}
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
              placeholder="Tell me about your project..."
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full md:w-auto px-8 py-3 rounded-lg font-medium text-primary-foreground bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_30px_hsl(199,89%,48%,0.3)] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {sending ? (
              <span className="animate-pulse">Sending...</span>
            ) : (
              <>
                <Send size={16} /> Send Message
              </>
            )}
          </button>
        </motion.form>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-6 mt-10"
        >
          {[
            { icon: Github, href: "#", label: "GitHub" },
            { icon: Linkedin, href: "#", label: "LinkedIn" },
            { icon: Mail, href: "mailto:parth@example.com", label: "Email" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="w-12 h-12 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:neon-glow transition-all duration-300"
            >
              <social.icon size={20} />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
