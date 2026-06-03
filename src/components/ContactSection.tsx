import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Send, Github, Linkedin, Mail, Eye, Trash2, Download, X } from "lucide-react";
import { toast } from "sonner";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}

const ContactSection = () => {
  const ref = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [sending, setSending] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Hidden admin/viewer states
  const [showAdmin, setShowAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Fetch messages from localStorage
  const loadMessages = () => {
    try {
      const stored = localStorage.getItem("portfolio_contact_messages");
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading localStorage:", e);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Handle header click to trigger admin view (click 5 times)
  const handleHeaderClick = () => {
    const nextCount = clickCount + 1;
    if (nextCount >= 5) {
      loadMessages();
      setShowAdmin(true);
      setClickCount(0);
      toast.info("Admin Mode: Displaying contact submissions.");
    } else {
      setClickCount(nextCount);
      // Reset count after 2 seconds of inactivity
      const timer = setTimeout(() => setClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  };

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["50px", "-30px"]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const newMessage: ContactMessage = {
      id: Date.now(),
      name,
      email,
      message,
      date: new Date().toLocaleString(),
    };

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        
        try {
          const stored = localStorage.getItem("portfolio_contact_messages");
          const currentMessages = stored ? JSON.parse(stored) : [];
          const updated = [newMessage, ...currentMessages];
          localStorage.setItem("portfolio_contact_messages", JSON.stringify(updated));
          setMessages(updated);
          
          setSending(false);
          toast.success(data.message || "Message sent successfully!");
          
          // Reset form inputs
          setName("");
          setEmail("");
          setMessage("");
        } catch (err) {
          setSending(false);
          toast.error("Saved but failed to cache database.");
        }
      })
      .catch((err) => {
        // Fallback: save to local storage if offline/localhost
        try {
          const stored = localStorage.getItem("portfolio_contact_messages");
          const currentMessages = stored ? JSON.parse(stored) : [];
          const updated = [newMessage, ...currentMessages];
          localStorage.setItem("portfolio_contact_messages", JSON.stringify(updated));
          setMessages(updated);
          
          setSending(false);
          toast.success("Message saved locally (offline mode)!");
          
          setName("");
          setEmail("");
          setMessage("");
        } catch (storageErr) {
          setSending(false);
          toast.error("Failed to submit form. Please check your network.");
        }
      });
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all submissions?")) {
      localStorage.removeItem("portfolio_contact_messages");
      setMessages([]);
      toast.success("All messages cleared.");
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `contact_messages_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteMessage = (id: number) => {
    const updated = messages.filter((msg) => msg.id !== id);
    localStorage.setItem("portfolio_contact_messages", JSON.stringify(updated));
    setMessages(updated);
    toast.success("Message deleted.");
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden" ref={sectionRef}>
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ["60px", "-60px"]) }}
        className="absolute right-1/4 bottom-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"
      />

      <div className="max-w-4xl mx-auto relative" ref={ref}>
        <motion.div
          style={{ y: parallaxY }}
          initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <p 
            onClick={handleHeaderClick}
            className="text-primary font-medium tracking-widest uppercase text-sm mb-3 cursor-pointer select-none active:scale-95 transition-transform"
            title="Click 5 times to view submissions"
          >
            Contact
          </p>
          <h2 className="font-display text-2xl md:text-5xl font-bold mb-4">
            Let's Build <span className="gradient-text">Together</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Have a project idea or just want to connect? I'd love to hear from you.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          name="contact"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass rounded-2xl p-8 md:p-10 space-y-6"
        >
          {/* Netlify Form Hidden Inputs */}
          <input type="hidden" name="form-name" value="contact" />
          <div className="hidden">
            <label>Don't fill this out: <input name="bot-field" /></label>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label className="text-sm text-muted-foreground mb-2 block">Name</label>
              <input
                required
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="Your name"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="text-sm text-muted-foreground mb-2 block">Email</label>
              <input
                required
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="your@email.com"
              />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label className="text-sm text-muted-foreground mb-2 block">Message</label>
            <textarea
              required
              rows={5}
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
              placeholder="Tell me about your project..."
            />
          </motion.div>
          <motion.button
            type="submit"
            disabled={sending}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto px-8 py-3 rounded-lg font-medium text-primary-foreground bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_30px_hsl(199,89%,48%,0.3)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {sending ? (
              <span className="animate-pulse">Sending...</span>
            ) : (
              <>
                <Send size={16} /> Send Message
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center gap-6 mt-10"
        >
          {[
            { icon: Github, href: "https://github.com/Parth844", label: "GitHub" },
            { icon: Linkedin, href: "https://linkedin.com/in/parthtyagi-design", label: "LinkedIn" },
            { icon: Mail, href: "mailto:Parthtyagi520@gmail.com", label: "Email" },
          ].map((social, i) => (
            <motion.a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
              className="w-12 h-12 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:neon-glow transition-all duration-300"
            >
              <social.icon size={20} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Admin Submissions Viewer Modal */}
      <AnimatePresence>
        {showAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-card border border-border rounded-xl shadow-2xl p-6 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <h3 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
                    <Eye size={20} className="text-primary" /> Contact Submissions
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Stored locally on your device</p>
                </div>
                <button
                  onClick={() => setShowAdmin(false)}
                  className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content / Message List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 min-h-[300px]">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
                    <p className="font-medium text-lg">No messages received yet</p>
                    <p className="text-sm mt-1 max-w-sm">Submissions will show up here once you fill out and submit the contact form.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-secondary/40 border border-border rounded-lg p-4 relative group/item hover:border-primary/20 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <div>
                          <p className="font-medium text-foreground text-sm">{msg.name}</p>
                          <p className="text-xs text-primary">{msg.email}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-muted-foreground">{msg.date}</span>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors md:opacity-0 group-hover/item:opacity-100 p-1"
                            title="Delete message"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground bg-background/50 border border-border/30 rounded p-3 whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground font-mono">
                  Total: {messages.length} message(s)
                </span>
                <div className="flex gap-3">
                  {messages.length > 0 && (
                    <>
                      <button
                        onClick={handleClearAll}
                        className="px-4 py-2 text-xs font-semibold rounded bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-all flex items-center gap-1.5"
                      >
                        <Trash2 size={13} /> Clear All
                      </button>
                      <button
                        onClick={handleDownloadJSON}
                        className="px-4 py-2 text-xs font-semibold rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-1.5"
                      >
                        <Download size={13} /> Download JSON
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowAdmin(false)}
                    className="px-4 py-2 text-xs font-semibold rounded bg-secondary text-foreground hover:bg-secondary/80 transition-all border border-border"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactSection;
