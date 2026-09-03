"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ExhibitorLead, StudentApplication } from "@/lib/dataStore";
import { Partner } from "@/data/partners";
import StudentBadge from "@/components/StudentBadge";
import { Html5Qrcode } from "html5-qrcode";
import {
  Shield,
  Building2,
  Users,
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  LogOut,
  Sparkles,
  BarChart3,
  Check,
  RefreshCw,
  Award,
  Lock,
  Upload,
  Image as ImageIcon,
  FileImage,
  Loader2,
  GraduationCap,
  School,
  HeartHandshake,
  FileText,
  Compass,
  Share2,
  QrCode,
  Camera,
  Mail,
  RotateCcw,
  X,
  Zap,
} from "lucide-react";

/**
 * Robust helper to extract and match student records from any scanned QR URL,
 * query parameters, raw badge code, student ID, email, or phone.
 */
function findMatchingStudent(rawInput: string, students: StudentApplication[]): StudentApplication | null {
  if (!rawInput || !students.length) return null;
  const input = rawInput.trim();
  const inputUpper = input.toUpperCase();

  // 1. URL search params parsing (e.g. ?id=...&code=... or full verification URL)
  try {
    let searchStr = "";
    if (input.includes("?")) {
      searchStr = input.split("?")[1];
    } else if (input.startsWith("http://") || input.startsWith("https://")) {
      searchStr = new URL(input).search.replace(/^\?/, "");
    }
    if (searchStr) {
      const params = new URLSearchParams(searchStr);
      const urlId = params.get("id") || params.get("ID");
      const urlCode = params.get("code") || params.get("CODE") || params.get("badgeId") || params.get("BADGEID") || params.get("CONFIRMBADGE");
      const urlEmail = params.get("email") || params.get("EMAIL");

      const match = students.find((s) => {
        if (urlId && s.id && s.id.toLowerCase() === urlId.toLowerCase()) return true;
        if (urlCode && s.badgeId && s.badgeId.toUpperCase().replace(/[-_]/g, "") === urlCode.toUpperCase().replace(/[-_]/g, "")) return true;
        if (urlEmail && s.email && s.email.toLowerCase() === urlEmail.toLowerCase()) return true;
        return false;
      });
      if (match) return match;
    }
  } catch (e) {
    // Ignore URL parse errors
  }

  // 2. Regex extraction for Badge ID (e.g. HFT-2026-XXXX) and Student ID (std_...)
  const badgeMatch = input.match(/HFT[-_]?2026[-_]?([A-Z0-9]{4,6})/i);
  if (badgeMatch) {
    const extracted = badgeMatch[0].toUpperCase().replace(/[-_]/g, "");
    const match = students.find((s) => s.badgeId && s.badgeId.toUpperCase().replace(/[-_]/g, "") === extracted);
    if (match) return match;
  }

  const stdMatch = input.match(/std_[0-9]+_[a-z0-9]+/i);
  if (stdMatch) {
    const extracted = stdMatch[0].toLowerCase();
    const match = students.find((s) => s.id && s.id.toLowerCase() === extracted);
    if (match) return match;
  }

  // 3. Exact & normalized field matching
  const cleanUpper = inputUpper.replace(/\s+/g, " ");
  const cleanPhone = input.replace(/[^0-9]/g, "");

  return (
    students.find((s) => {
      const sId = (s.id || "").toUpperCase();
      const sBadge = (s.badgeId || "").toUpperCase();
      const sEmail = (s.email || "").toUpperCase();
      const sPhone = (s.phone || "").replace(/[^0-9]/g, "");
      const sFullName = `${s.firstName || ""} ${s.lastName || ""}`.trim().toUpperCase();

      if (sBadge === cleanUpper || sBadge.replace(/[-_]/g, "") === cleanUpper.replace(/[-_]/g, "")) return true;
      if (sId === cleanUpper) return true;
      if (sEmail === cleanUpper) return true;
      if (cleanPhone.length >= 8 && sPhone.includes(cleanPhone)) return true;
      if (sFullName && (sFullName === cleanUpper || cleanUpper.includes(sFullName))) return true;

      // Substring fallback in raw query
      if (sBadge && inputUpper.includes(sBadge)) return true;
      if (sId && inputUpper.includes(sId)) return true;

      return false;
    }) || null
  );
}

function CameraScannerComponent({
  onScanResult,
}: {
  onScanResult: (text: string) => void;
}) {
  const { language } = useLanguage();
  const [active, setActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!active) return;
    let html5Qr: Html5Qrcode | null = null;
    let isMounted = true;

    const initScanner = async () => {
      try {
        setCameraError(null);
        setScanSuccess(false);

        // Step 1: Detect available cameras
        let availableDevices: { id: string; label: string }[] = [];
        try {
          const devs = await Html5Qrcode.getCameras();
          if (devs && devs.length > 0) {
            // Sort to place rear/back cameras first
            const rear = devs.filter((d) => /back|rear|environment|arrière/i.test(d.label));
            const front = devs.filter((d) => /front|user|avant|selfie/i.test(d.label));
            const others = devs.filter((d) => !rear.includes(d) && !front.includes(d));
            availableDevices = [...rear, ...others, ...front];
            if (availableDevices.length === 0) availableDevices = devs;
            if (isMounted) {
              setCameras(availableDevices);
            }
          }
        } catch (camListErr) {
          console.warn("Could not enumerate camera devices:", camListErr);
        }

        if (!isMounted) return;

        // Step 2: Initialize Html5Qrcode instance
        html5Qr = new Html5Qrcode("hft-custom-qr-reader", false);
        scannerRef.current = html5Qr;

        // Configuration:
        // CRITICAL: Do NOT force aspectRatio: 1.0 because smartphone rear camera hardware
        // fails to negotiate 1:1 constraints and streams a black feed. CSS handles the visual crop.
        const config = {
          fps: 15,
          qrbox: { width: 240, height: 240 },
          disableFlip: true,
        };

        const handleSuccess = (decodedText: string) => {
          if (!isMounted) return;
          // Audio chime
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.12);
          } catch (e) {}

          // Haptic vibration
          if (typeof window !== "undefined" && window.navigator?.vibrate) {
            window.navigator.vibrate([40, 30, 40]);
          }

          setScanSuccess(true);
          onScanResult(decodedText);

          setTimeout(() => {
            if (isMounted) {
              setActive(false);
              setScanSuccess(false);
            }
          }, 650);
        };

        // Step 3: Determine which camera ID or facing mode to start
        let selectedDevice = availableDevices[currentCameraIndex % Math.max(1, availableDevices.length)];

        try {
          if (selectedDevice && selectedDevice.id) {
            await html5Qr.start(selectedDevice.id, config, handleSuccess, () => {});
          } else {
            await html5Qr.start({ facingMode: "environment" }, config, handleSuccess, () => {});
          }
        } catch (specificCamErr) {
          console.warn("Starting with device ID failed, falling back to facingMode: environment", specificCamErr);
          await html5Qr.start({ facingMode: "environment" }, config, handleSuccess, () => {});
        }

        if (isMounted) {
          setIsScanning(true);
        }
      } catch (err: any) {
        console.error("Camera scanner initialization error:", err);
        if (isMounted) {
          setIsScanning(false);
          setCameraError(
            language === "ar"
              ? "تعذر تشغيل الكاميرا الخلفية. يرجى التأكد من منح الإذن للمتصفح أو تجربة زر التبديل."
              : "Could not access the camera. Please allow camera permissions in your browser or try switching cameras."
          );
        }
      }
    };

    const timer = setTimeout(() => {
      initScanner();
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (html5Qr && html5Qr.isScanning) {
        html5Qr
          .stop()
          .catch(() => {})
          .finally(() => {
            try {
              html5Qr?.clear();
            } catch (e) {}
          });
      }
    };
  }, [active, currentCameraIndex, language, onScanResult]);

  const toggleCameraFacing = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop().catch(() => {});
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
    setCurrentCameraIndex((prev) => (prev + 1) % Math.max(1, cameras.length || 2));
  };

  return (
    <div className="space-y-4">
      {!active ? (
        <button
          onClick={() => setActive(true)}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#003876] via-[#0E1B2C] to-[#003876] hover:from-[#F05A22] hover:to-[#003876] text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-3 border border-white/10 group"
        >
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="w-4 h-4 text-[#FFBD0E] animate-pulse" />
          </div>
          <span>
            {language === "ar"
              ? "فتح ماسح الكاميرا السريع (Scan QR)"
              : "Open Fast Camera QR Scanner"}
          </span>
        </button>
      ) : (
        <div className="bg-slate-950 border-2 border-[#003876] rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 text-center animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase text-[#FFBD0E] tracking-wider">
                {language === "ar" ? "الكاميرا جاهزة للمسح" : "Scanner Ready — Aim at Badge"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleCameraFacing}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 active:scale-95 cursor-pointer"
                title="Switch Camera"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#FFBD0E]" />
                <span>
                  {language === "ar"
                    ? "تبديل الكاميرا"
                    : cameras.length > 1
                    ? `Cam ${currentCameraIndex + 1}/${cameras.length}`
                    : "Flip Camera"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (scannerRef.current && scannerRef.current.isScanning) {
                    scannerRef.current
                      .stop()
                      .catch(() => {})
                      .finally(() => {
                        try {
                          scannerRef.current?.clear();
                        } catch (e) {}
                      });
                  }
                  setActive(false);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
              >
                <X className="w-4 h-4" />
                <span>{language === "ar" ? "إلغاء" : "Close"}</span>
              </button>
            </div>
          </div>

          {/* Camera Viewfinder Box with Laser Reticle */}
          <div className="relative w-full max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner flex items-center justify-center">
            {/* HTML5 QR Code Mount Target */}
            <div id="hft-custom-qr-reader" className="w-full h-full overflow-hidden" />

            {/* Futuristic Targeting Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className={`relative w-56 h-56 sm:w-64 sm:h-64 transition-all duration-300 ${
                  scanSuccess
                    ? "scale-105 border-4 border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.8)] rounded-3xl"
                    : ""
                }`}
              >
                {/* 4 Golden Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-2xl border-[#FFBD0E] shadow-[0_0_10px_#FFBD0E]" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-2xl border-[#FFBD0E] shadow-[0_0_10px_#FFBD0E]" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-2xl border-[#FFBD0E] shadow-[0_0_10px_#FFBD0E]" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-2xl border-[#FFBD0E] shadow-[0_0_10px_#FFBD0E]" />

                {/* Animated Horizontal Laser Beam */}
                {!scanSuccess && (
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#FFBD0E] to-transparent shadow-[0_0_12px_#FFBD0E] animate-scan-laser pointer-events-none" />
                )}

                {scanSuccess && (
                  <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Helper caption */}
          <p className="text-xs text-slate-400 font-medium">
            {language === "ar"
              ? "وجّه الكاميرا مباشرة نحو رمز الاستجابة السريعة (QR) على بطاقة الطالب"
              : "Align the QR code on the student pass badge inside the golden frame"}
          </p>

          {cameraError && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold text-center">
              {cameraError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "sponsors" | "students" | "scanner">("overview");

  // Data states
  const [leads, setLeads] = useState<ExhibitorLead[]>([]);
  const [sponsors, setSponsors] = useState<Partner[]>([]);
  const [students, setStudents] = useState<StudentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Lead filters & detail modal
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<ExhibitorLead | null>(null);

  // Student filters & detail modal
  const [studentSearch, setStudentSearch] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<StudentApplication | null>(null);
  const [scanConfirmationNotice, setScanConfirmationNotice] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Reception Scanner Tab State
  const [scannerInput, setScannerInput] = useState("");
  const [scannedStudentResult, setScannedStudentResult] = useState<StudentApplication | null>(null);
  const [scannerError, setScannerError] = useState("");

  const handleProcessScanOrSearch = (rawInput: string) => {
    const raw = (rawInput || "").trim();
    if (!raw) return;
    const match = findMatchingStudent(raw, students);
    if (match) {
      setScannedStudentResult(match);
      setScannerError("");
      setScannerInput(match.badgeId || match.email || match.id);
    } else {
      setScannedStudentResult(null);
      let displayRef = raw;
      try {
        if (displayRef.includes("?")) {
          const sp = new URLSearchParams(displayRef.split("?")[1]);
          displayRef = sp.get("code") || sp.get("CODE") || sp.get("id") || sp.get("ID") || sp.get("name") || displayRef;
        }
      } catch (e) {}
      setScannerError(
        language === "ar"
          ? `لم يتم العثور على طالب بالمعرف: ${displayRef}`
          : `No student found with reference: ${displayRef}`
      );
    }
  };

  // Sponsor manager state
  const [sponsorEditionFilter, setSponsorEditionFilter] = useState<number>(2026);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Partner | null>(null);

  // Drag & Drop / Upload States
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const [isDraggingGrid, setIsDraggingGrid] = useState(false);
  const [dragTargetSlug, setDragTargetSlug] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New/Edit Sponsor Form
  const [sponsorForm, setSponsorForm] = useState<Partial<Partner>>({
    name: "",
    slug: "",
    logo: "",
    edition: 2026,
    sponsorTier: "silver",
    website: "",
    description: { en: "", ar: "" },
  });

  // Check auth session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("hft_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
        fetchData();
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "hft2026" || passcode === "admin") {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("hft_admin_auth", "true");
      }
      fetchData();
    } else {
      setLoginError(language === "ar" ? "رمز الدخول غير صحيح." : "Incorrect passcode.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("hft_admin_auth");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, sponsorsRes, studentsRes] = await Promise.all([
        fetch("/api/leads", { cache: "no-store" }),
        fetch("/api/sponsors", { cache: "no-store" }),
        fetch("/api/students", { cache: "no-store" }),
      ]);
      const leadsData = await leadsRes.json();
      const sponsorsData = await sponsorsRes.json();
      const studentsData = await studentsRes.json();

      if (leadsData.success) setLeads(leadsData.data);
      if (sponsorsData.success) setSponsors(sponsorsData.data);
      if (studentsData.success) setStudents(studentsData.data);
    } catch (err) {
      console.error("Error loading admin data", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Reception QR Code scanning via URL (?confirmBadge=HFT-2026-XXXX)
  useEffect(() => {
    if (students.length > 0 && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const confirmBadge = params.get("confirmBadge");
      if (confirmBadge) {
        const query = confirmBadge.toUpperCase().trim();
        const match = students.find(
          (st) =>
            st.badgeId?.toUpperCase() === query ||
            st.id.toUpperCase() === query
        );
        if (match) {
          setScannerInput(query);
          setScannedStudentResult(match);
          setActiveTab("scanner");
        }
      }
    }
  }, [students]);

  // Helper to read file locally into base64 Data URL for instant rendering
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Upload logo image helper
  const uploadLogoFile = async (file: File, editionYear?: number): Promise<string | null> => {
    if (!file.type || !file.type.startsWith("image/")) {
      alert(language === "ar" ? "يرجى اختيار ملف صورة صالح (PNG, JPG, SVG, WEBP...)." : "Please select a valid image file (PNG, JPG, SVG, WEBP...).");
      return null;
    }

    setIsUploadingLogo(true);
    try {
      const localDataUrl = await readFileAsDataUrl(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("edition", String(editionYear || sponsorForm.edition || sponsorEditionFilter || 2026));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        return data.dataUrl || data.url || localDataUrl;
      } else {
        return localDataUrl;
      }
    } catch (err) {
      console.error("Upload error:", err);
      try {
        return await readFileAsDataUrl(file);
      } catch {
        return null;
      }
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Handle Drag & Drop in Modal
  const handleModalDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingModal(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const uploadedUrl = await uploadLogoFile(file);
      if (uploadedUrl) {
        const inferredName = sponsorForm.name || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").toUpperCase();
        setSponsorForm((prev) => ({
          ...prev,
          logo: uploadedUrl,
          name: inferredName,
        }));
      }
    }
  };

  // Handle Drag & Drop onto New Sponsor Dropzone Card
  const handleNewSponsorDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingGrid(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const uploadedUrl = await uploadLogoFile(file, sponsorEditionFilter);
      if (uploadedUrl) {
        const inferredName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").toUpperCase();
        setEditingSponsor(null);
        setSponsorForm({
          name: inferredName,
          slug: inferredName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          logo: uploadedUrl,
          edition: sponsorEditionFilter as any,
          sponsorTier: "silver",
          website: "",
          description: { en: "", ar: "" },
        });
        setShowSponsorModal(true);
      }
    }
  };

  // Handle Drag & Drop directly onto existing Sponsor Card
  const handleSponsorCardDrop = async (e: React.DragEvent, targetSponsor: Partner) => {
    e.preventDefault();
    setDragTargetSlug(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const uploadedUrl = await uploadLogoFile(file, targetSponsor.edition);
      if (uploadedUrl) {
        try {
          const res = await fetch("/api/sponsors", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: targetSponsor.slug, logo: uploadedUrl }),
          });
          const data = await res.json();
          if (data.success) {
            setSponsors(data.data);
          }
        } catch (err) {
          alert("Erreur lors de la mise à jour du logo de l'entreprise.");
        }
      }
    }
  };

  // Lead status updater
  const handleUpdateLeadStatus = async (id: string, status: ExhibitorLead["status"]) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        if (selectedLead?.id === id) {
          setSelectedLead((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm(language === "ar" ? "هل أنت متأكد من حذف طلب العارض؟" : "Are you sure you want to delete this exhibitor application?")) return;
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "delete" }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
      }
    } catch (err) {
      alert(language === "ar" ? "حدث خطأ أثناء الحذف" : "Error during deletion");
    }
  };

  // Student status updater
  const handleUpdateStudentStatus = async (id: string, status: StudentApplication["status"]) => {
    try {
      setIsSendingEmail(true);
      const res = await fetch("/api/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
        if (selectedStudent?.id === id) {
          setSelectedStudent((prev) => (prev ? { ...prev, status } : null));
        }
        if (status === "Confirmé") {
          if (data.emailSent) {
            alert(language === "ar" ? "✓ تم تحديث الحالة وإرسال بطاقة الدخول عبر البريد الإلكتروني!" : "✓ Status updated! Confirmation email with Badge Pass PDF has been sent.");
          } else {
            alert(language === "ar" ? "تم تحديث الحالة إلى 'مؤكد'. تعذر إرسال الإشعار البريدي حالياً." : "Status updated to 'Confirmed'. Note: Email delivery encountered an error or is pending.");
          }
        }
      }
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleResendStudentEmail = async (id: string) => {
    try {
      setIsSendingEmail(true);
      const res = await fetch("/api/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "resend_email" }),
      });
      const data = await res.json();
      if (data.success && data.emailSent) {
        alert("✓ Email de confirmation et Badge PDF renvoyés avec succès !");
      } else {
        alert(`Erreur d'envoi d'email : ${data.emailResult?.error || data.error || "Échec SMTP"}`);
      }
    } catch (err: any) {
      alert(language === "ar" ? "خطأ في الاتصال أثناء إرسال البريد الإلكتروني." : "Connection error while dispatching email.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm(language === "ar" ? "هل أنت متأكد من حذف تسجيل الطالب؟" : "Are you sure you want to delete this student registration?")) return;
    try {
      const res = await fetch("/api/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "delete" }),
      });
      const data = await res.json();
      if (data.success) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        if (selectedStudent?.id === id) setSelectedStudent(null);
      }
    } catch (err) {
      alert(language === "ar" ? "حدث خطأ أثناء الحذف" : "Error during deletion");
    }
  };

  // Sponsor CRUD Actions
  const handleSaveSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorForm.name || !sponsorForm.logo) {
      alert("Le nom et l'image / logo de l'entreprise sont obligatoires.");
      return;
    }

    const method = editingSponsor ? "PUT" : "POST";
    const payload = editingSponsor
      ? { ...editingSponsor, ...sponsorForm }
      : {
          ...sponsorForm,
          slug: sponsorForm.slug || sponsorForm.name!.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        };

    try {
      const res = await fetch("/api/sponsors", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSponsors(data.data);
        setShowSponsorModal(false);
        setEditingSponsor(null);
        setSponsorForm({ name: "", slug: "", logo: "", edition: 2026, sponsorTier: "silver", website: "", description: { en: "", ar: "" } });
      }
    } catch (err) {
      alert("Erreur de sauvegarde");
    }
  };

  const handleDeleteSponsor = async (slug: string, edition?: number) => {
    if (!confirm(language === "ar" ? "هل أنت متأكد من حذف هذه الشركة / الراعي؟" : "Are you sure you want to delete this company / sponsor?")) return;
    try {
      const url = edition ? `/api/sponsors?slug=${slug}&edition=${edition}` : `/api/sponsors?slug=${slug}`;
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSponsors(data.data);
      }
    } catch (err) {
      alert(language === "ar" ? "حدث خطأ أثناء الحذف" : "Error during deletion");
    }
  };

  const openEditSponsor = (s: Partner) => {
    setEditingSponsor(s);
    setSponsorForm(s);
    setShowSponsorModal(true);
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.companyName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.representativeName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(leadSearch.toLowerCase());
    const matchesStatus = leadStatusFilter === "all" || l.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const query = studentSearch.toLowerCase();
    const matchesSearch =
      s.firstName.toLowerCase().includes(query) ||
      s.lastName.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      (s.university && s.university.toLowerCase().includes(query)) ||
      (s.fieldOfStudyOrWork && s.fieldOfStudyOrWork.toLowerCase().includes(query)) ||
      (s.wilaya && s.wilaya.toLowerCase().includes(query)) ||
      (s.currentStatus && s.currentStatus.toLowerCase().includes(query));
    const matchesStatus = studentStatusFilter === "all" || s.status === studentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Sponsors
  const filteredSponsors = sponsors.filter((s) => s.edition === sponsorEditionFilter);

  // Login view if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E1B2C] flex items-center justify-center p-6 text-white">
        <div className="bg-gradient-to-br from-[#002855] via-[#003876] to-[#0E1B2C] border border-white/20 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F05A22] flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{language === "ar" ? "فضاء إدارة HFT 2026" : "HFT 2026 Administration Portal"}</h1>
            <p className="text-white/70 text-xs mt-1">{language === "ar" ? "إدارة العارضين والرعاة والطلبة" : "Exhibitor leads, sponsors & student management"}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-white/80 mb-2">
                {language === "ar" ? "رمز دخول المسؤول" : "Administrator Passcode"}
              </label>
              <input
                type="password"
                placeholder={language === "ar" ? "أدخل الرمز" : "Enter passcode"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F05A22] font-semibold text-center text-lg"
              />
              {loginError && <p className="text-red-400 text-xs mt-1.5 font-bold text-center">{loginError}</p>}
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#F05A22] hover:bg-[#FFBD0E] hover:text-[#0E1B2C] text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg"
            >
              {language === "ar" ? "تسجيل الدخول" : "Sign In"}
            </button>
          </form>

          <p className="text-[11px] text-white/40 font-medium">
            His Future Talents Administration • Protected System
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-slate-900 flex flex-col text-start">
      
      {/* Admin Top Navigation Header */}
      <header className="bg-[#003876] text-white py-4 px-4 sm:px-8 shadow-md sticky top-0 z-40 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-3 h-3 rounded-full bg-[#F05A22] animate-pulse shrink-0" />
            <h1 className="font-black text-sm sm:text-xl tracking-tight truncate">
              HIS Future Talents — Admin
            </h1>
            <span className="bg-white/10 text-[#58B9FF] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/15 hidden md:inline shrink-0">
              {language === "ar" ? "دورة 2026" : "Edition 2026"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={fetchData}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white/80 hover:text-white"
              title={language === "ar" ? "تحديث البيانات" : "Refresh data"}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/80 text-white text-xs font-bold transition-all border border-white/15"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{language === "ar" ? "تسجيل الخروج" : "Log Out"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="bg-[#0E1B2C] text-white border-b border-white/10 px-4 sm:px-8 py-3 overflow-x-auto no-scrollbar whitespace-nowrap w-full">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 min-w-max">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
              activeTab === "overview"
                ? "bg-[#F05A22] text-white shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            {language === "ar" ? "نظرة عامة" : "Overview"}
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative shrink-0 ${
              activeTab === "leads"
                ? "bg-[#F05A22] text-white shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            {language === "ar" ? "طلبات العارضين" : "Exhibitor Applications"}
            {leads.filter((l) => l.status === "Nouveau").length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                {leads.filter((l) => l.status === "Nouveau").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative shrink-0 ${
              activeTab === "students"
                ? "bg-[#F05A22] text-white shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            {language === "ar" ? "تسجيلات الطلبة" : "Student Registrations"}
            {students.filter((s) => s.status === "Nouveau").length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                {students.filter((s) => s.status === "Nouveau").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("scanner")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative shrink-0 ${
              activeTab === "scanner"
                ? "bg-emerald-600 text-white shadow-md scale-105"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30"
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>{language === "ar" ? "ماسح الاستقبال" : "Check-in Scanner"}</span>
          </button>

          <button
            onClick={() => setActiveTab("sponsors")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
              activeTab === "sponsors"
                ? "bg-[#F05A22] text-white shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            {language === "ar" ? "إدارة الرعاة والشركات" : "Sponsors & Companies"}
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex-1 w-full overflow-x-hidden">

        {scanConfirmationNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500 text-white font-black text-sm text-center shadow-lg border-2 border-emerald-400 animate-fadeIn flex items-center justify-between gap-4">
            <span className="truncate">{scanConfirmationNotice}</span>
            <button
              onClick={() => setScanConfirmationNotice(null)}
              className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold shrink-0"
            >
              {language === "ar" ? "إغلاق" : "Close"}
            </button>
          </div>
        )}

        {/* ── 1. OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-black uppercase tracking-wider">{language === "ar" ? "طلبات العارضين" : "Exhibitor Leads"}</span>
                  <Building2 className="w-5 h-5 text-[#003876]" />
                </div>
                <p className="text-3xl font-black text-[#003876]">{leads.length}</p>
                <p className="text-xs text-slate-500 font-medium">
                  {leads.filter((l) => l.status === "Nouveau").length} nouvelles demandes
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-black uppercase tracking-wider">{language === "ar" ? "تسجيلات الطلبة" : "Student Registrations"}</span>
                  <GraduationCap className="w-5 h-5 text-[#F05A22]" />
                </div>
                <p className="text-3xl font-black text-[#F05A22]">{students.length}</p>
                <p className="text-xs text-slate-500 font-medium">
                  {students.filter((s) => s.status === "Nouveau").length} nouveaux inscrits
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-black uppercase tracking-wider">{language === "ar" ? "العارضون المؤكدون" : "Confirmed Exhibitors"}</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-3xl font-black text-emerald-600">
                  {leads.filter((l) => l.status === "Confirmé").length}
                </p>
                <p className="text-xs text-slate-500 font-medium">{language === "ar" ? "شراكات مؤكدة" : "Confirmed Partnerships"}</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-black uppercase tracking-wider">Sponsors 2026</span>
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-3xl font-black text-amber-500">
                  {sponsors.filter((s) => s.edition === 2026).length}
                </p>
                <p className="text-xs text-slate-500 font-medium">Sponsors au catalogue</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-2 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-black uppercase tracking-wider">Total Entreprises</span>
                  <Users className="w-5 h-5 text-[#58B9FF]" />
                </div>
                <p className="text-3xl font-black text-slate-800">{sponsors.length}</p>
                <p className="text-xs text-slate-500 font-medium">Historique 2024 - 2026</p>
              </div>
            </div>

            {/* Recent Submissions Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#003876]">{language === "ar" ? "أحدث طلبات العارضين" : "Recent Exhibitor Applications"}</h2>
                <button
                  onClick={() => setActiveTab("leads")}
                  className="text-xs font-bold text-[#F05A22] hover:underline"
                >
                  Voir tout
                </button>
              </div>

              {leads.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">Aucune demande d'exposition enregistrée pour le moment.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {leads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-slate-900">{lead.companyName}</span>
                        <p className="text-xs text-slate-500">{lead.representativeName} • {lead.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                          lead.status === "Nouveau" ? "bg-amber-100 text-amber-700" :
                          lead.status === "Confirmé" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {lead.status}
                        </span>
                        <button
                          onClick={() => { setSelectedLead(lead); setActiveTab("leads"); }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 2. LEADS TAB ── */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            {/* Filters bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs w-full overflow-hidden">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder={language === "ar" ? "بحث عن شركة، اسم، بريد..." : "Search company, name, email..."}
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#003876]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-500 shrink-0">{language === "ar" ? "الحالة :" : "Status:"}</span>
                {["all", "Nouveau", "En cours", "Confirmé", "Refusé"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setLeadStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      leadStatusFilter === st
                        ? "bg-[#003876] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st === "all" ? "Tous" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden w-full">
              <div className="w-full overflow-x-auto no-scrollbar">
                <table className="w-full text-start text-xs min-w-[650px]">
                  <thead className="bg-[#003876] text-white font-black uppercase tracking-wider">
                    <tr>
                      <th className="p-4 text-start">Entreprise</th>
                      <th className="p-4 text-start">{language === "ar" ? "الممثل والاتصال" : "Representative & Contact"}</th>
                      <th className="p-4 text-center">Personnes</th>
                      <th className="p-4 text-center">Pack Souhaité</th>
                      <th className="p-4 text-center">{language === "ar" ? "الحالة" : "Status"}</th>
                      <th className="p-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                          {language === "ar" ? "لم يتم العثور على أي طلبات عارضين." : "No exhibitor applications found."}
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <span className="font-bold text-sm text-slate-900 block">{lead.companyName}</span>
                            <span className="text-[10px] text-slate-400">Réf: {lead.id}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-800 block">{lead.representativeName} ({lead.role})</span>
                            <span className="text-slate-500 block">{lead.email} • {lead.phone}</span>
                          </td>
                          <td className="p-4 text-center font-bold text-slate-700">
                            {lead.representativesCount} personnes
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-[#003876]">
                              {lead.packageDesired}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                              className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border cursor-pointer ${
                                lead.status === "Nouveau" ? "bg-amber-100 text-amber-800 border-amber-300" :
                                lead.status === "Confirmé" ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                                lead.status === "En cours" ? "bg-blue-100 text-blue-800 border-blue-300" :
                                "bg-red-100 text-red-800 border-red-300"
                              }`}
                            >
                              <option value="Nouveau">Nouveau</option>
                              <option value="En cours">En cours</option>
                              <option value="Confirmé">Confirmé</option>
                              <option value="Refusé">Refusé</option>
                            </select>
                          </td>
                          <td className="p-4 text-end">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                                title={language === "ar" ? "عرض التفاصيل الكاملة" : "View full details"}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600"
                                title={language === "ar" ? "حذف" : "Delete"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. STUDENTS TAB ── */}
        {activeTab === "students" && (
          <div className="space-y-6">
            {/* Filters bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs w-full overflow-hidden">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder={language === "ar" ? "بحث عن اسم، جامعة، تخصص..." : "Search name, university, field, company..."}
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#003876]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-500 shrink-0">{language === "ar" ? "الحالة :" : "Status:"}</span>
                {["all", "Nouveau", "En cours", "Confirmé", "Refusé"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStudentStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      studentStatusFilter === st
                        ? "bg-[#003876] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st === "all" ? "Tous" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden w-full">
              <div className="w-full overflow-x-auto no-scrollbar">
                <table className="w-full text-start text-xs min-w-[700px]">
                  <thead className="bg-[#003876] text-white font-black uppercase tracking-wider">
                    <tr>
                      <th className="p-4 text-start">{language === "ar" ? "البطاقة / الطالب" : "Pass / Student"}</th>
                      <th className="p-4 text-start">{language === "ar" ? "الولاية والوضعية" : "Wilaya & Status"}</th>
                      <th className="p-4 text-start">Domaine & Établissement</th>
                      <th className="p-4 text-center">CV PDF</th>
                      <th className="p-4 text-center">{language === "ar" ? "حالة التسجيل" : "Registration Status"}</th>
                      <th className="p-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                          {language === "ar" ? "لم يتم العثور على أي تسجيل طالب." : "No student registrations found."}
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((std) => (
                        <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <span className="text-[10px] font-black uppercase text-[#F05A22] bg-[#F05A22]/10 px-2 py-0.5 rounded-md inline-block mb-0.5">
                              {std.badgeId || "HFT-2026"}
                            </span>
                            <span className="font-bold text-sm text-slate-900 block">
                              {std.firstName} {std.lastName}
                            </span>
                            <span className="text-slate-500 text-[11px] block">{std.email} • {std.phone}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-slate-800 block">{std.currentStatus || (language === "ar" ? "طالب" : "Student")}</span>
                            <span className="text-slate-500 text-[11px] block">{std.wilaya ? `Wilaya: ${std.wilaya}` : std.ageCategory}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-800 block">{std.fieldOfStudyOrWork || (std as any).fieldOfStudy}</span>
                            <span className="text-slate-400 text-[11px] block">{std.university || "Non spécifié"}</span>
                          </td>
                          <td className="p-4 text-center">
                            {std.cvUrl ? (
                              <a
                                href={std.cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold hover:bg-emerald-100"
                                title="Voir CV PDF"
                              >
                                <FileText className="w-3 h-3 text-emerald-600" />
                                <span>CV PDF</span>
                              </a>
                            ) : (
                              <span className="text-slate-300 text-[10px]">Non fournie</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <select
                              value={std.status}
                              onChange={(e) => handleUpdateStudentStatus(std.id, e.target.value as any)}
                              className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border cursor-pointer ${
                                std.status === "Nouveau" ? "bg-amber-100 text-amber-800 border-amber-300" :
                                std.status === "Confirmé" ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                                std.status === "En cours" ? "bg-blue-100 text-blue-800 border-blue-300" :
                                "bg-red-100 text-red-800 border-red-300"
                              }`}
                            >
                              <option value="Nouveau">Nouveau</option>
                              <option value="En cours">En cours</option>
                              <option value="Confirmé">Confirmé</option>
                              <option value="Refusé">Refusé</option>
                            </select>
                          </td>
                          <td className="p-4 text-end">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedStudent(std)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                                title={language === "ar" ? "عرض التفاصيل" : "View details"}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(std.id)}
                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600"
                                title={language === "ar" ? "حذف" : "Delete"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 4. SPONSORS MANAGER TAB (WITH ADMIN DRAG & DROP) ── */}
        {activeTab === "sponsors" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs w-full overflow-hidden">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <span className="text-xs font-bold text-slate-500 shrink-0">Édition :</span>
                {[2026, 2025, 2024].map((ed) => (
                  <button
                    key={ed}
                    onClick={() => setSponsorEditionFilter(ed)}
                    className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-black uppercase transition-all shrink-0 ${
                      sponsorEditionFilter === ed
                        ? "bg-[#003876] text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Édition {ed}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setEditingSponsor(null);
                    setSponsorForm({ name: "", slug: "", logo: "", edition: sponsorEditionFilter as any, sponsorTier: "silver", website: "", description: { en: "", ar: "" } });
                    setShowSponsorModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#F05A22] hover:bg-[#FFBD0E] hover:text-[#0E1B2C] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un sponsor / entreprise
                </button>
              </div>
            </div>

            {/* Admin Drag & Drop Quick Notice */}
            <div className="bg-[#003876]/5 border border-[#003876]/15 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-[#003876] font-semibold">
              <Upload className="w-5 h-5 text-[#F05A22] shrink-0" />
              <span>
                <strong>Fonction Glisser-Déposer Administrateur :</strong> Vous pouvez glisser et déposer l'image d'un logo directement sur la carte "Glisser un logo ici" ou sur n'importe quelle carte entreprise ci-dessous pour modifier son logo instantanément !
              </span>
            </div>

            {/* Sponsor Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Special Admin Drag & Drop Upload Dropzone Card */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingGrid(true);
                }}
                onDragLeave={() => setIsDraggingGrid(false)}
                onDrop={handleNewSponsorDrop}
                onClick={() => {
                  setEditingSponsor(null);
                  setSponsorForm({ name: "", slug: "", logo: "", edition: sponsorEditionFilter as any, sponsorTier: "silver", website: "", description: { en: "", ar: "" } });
                  setShowSponsorModal(true);
                }}
                className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[220px] group ${
                  isDraggingGrid
                    ? "border-[#F05A22] bg-[#F05A22]/10 scale-105 shadow-xl"
                    : "border-slate-300 hover:border-[#F05A22] bg-slate-50/60 hover:bg-white"
                }`}
              >
                {isUploadingLogo ? (
                  <div className="flex flex-col items-center gap-2 text-[#003876]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#F05A22]" />
                    <span className="font-bold text-xs">{language === "ar" ? "جاري رفع الشعار..." : "Uploading logo..."}</span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 group-hover:border-[#F05A22] flex items-center justify-center shadow-xs group-hover:scale-110 transition-all mb-3 text-[#F05A22]">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h4 className="font-black text-sm text-[#003876] tracking-tight">
                      Glissez-déposez un logo ici
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      Ou cliquez pour ajouter une entreprise (Édition {sponsorEditionFilter})
                    </p>
                    <span className="mt-3 px-3 py-1 rounded-full bg-[#F05A22]/10 text-[#F05A22] text-[10px] font-black uppercase tracking-wider">
                      Format PNG, JPG, SVG, WEBP
                    </span>
                  </>
                )}
              </div>

              {/* Render Existing Sponsors */}
              {filteredSponsors.map((sponsor) => {
                const isTargetingThis = dragTargetSlug === sponsor.slug;
                return (
                  <div
                    key={sponsor.slug}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragTargetSlug(sponsor.slug);
                    }}
                    onDragLeave={() => setDragTargetSlug(null)}
                    onDrop={(e) => handleSponsorCardDrop(e, sponsor)}
                    className={`bg-white border rounded-3xl p-5 flex flex-col justify-between shadow-soft hover:shadow-premium transition-all space-y-4 relative group ${
                      isTargetingThis
                        ? "border-[#F05A22] ring-4 ring-[#F05A22]/20 bg-[#F05A22]/5 scale-102"
                        : sponsor.sponsorTier === "silver"
                        ? "border-slate-300 ring-2 ring-slate-300/60"
                        : "border-slate-200"
                    }`}
                  >
                    {isTargetingThis && (
                      <div className="absolute inset-0 bg-[#003876]/80 backdrop-blur-xs rounded-3xl z-20 flex flex-col items-center justify-center text-white p-4 text-center">
                        <Upload className="w-8 h-8 text-[#F05A22] animate-bounce mb-1" />
                        <span className="font-black text-xs">Déposer pour remplacer le logo</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                          {sponsor.sponsorTier || "Partenaire"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">Édition {sponsor.edition}</span>
                      </div>

                      <div className="aspect-[16/9] w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center relative group/img">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            // Suppress broken alt icon if path is invalid
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-slate-950/40 rounded-2xl opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                          <Upload className="w-3.5 h-3.5 text-[#F05A22]" />
                          <span>{language === "ar" ? "إسقاط شعار جديد" : "Drag new logo here"}</span>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-base text-[#003876]">{sponsor.name}</h3>
                      {sponsor.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {language === "ar" ? sponsor.description.ar : (sponsor.description.en || sponsor.description.ar)}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      {sponsor.website ? (
                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#58B9FF] font-bold hover:underline flex items-center gap-1">
                          <span>{language === "ar" ? "الموقع الرسمي" : "Website"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : <span />}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditSponsor(sponsor)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title={language === "ar" ? "تعديل" : "Edit"}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSponsor(sponsor.slug, sponsor.edition)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600"
                          title={language === "ar" ? "حذف" : "Delete"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 5. SCANNER QR CODE TAB ── */}
        {activeTab === "scanner" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-start">
            
            {/* Tab Header Banner */}
            <div className="bg-[#003876] text-white rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F05A22] flex items-center justify-center text-white shadow-md">
                  <QrCode className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-[#FFBD0E] tracking-wider">Réception & Contrôle d'Accès</span>
                  <h2 className="text-2xl sm:text-3xl font-black">Scanner Pass QR & Validation Entrée</h2>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                {language === "ar" ? "امسح رمز QR للطالب بالماسح أو الكاميرا أو أدخل المعرف المرجعي (مثال: HFT-2026-X89A2)." : "Scan the student QR Code with your reader / camera or enter the reference code (e.g. HFT-2026-X89A2)."}
              </p>
            </div>

            {/* Scanner Input / Search Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg space-y-4">
              <label className="block text-xs font-black uppercase text-[#003876]">
                Saisir ou Scanner la Référence Pass (Badge ID / Email)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Ex: HFT-2026-X89A2 ou email@example.com"
                    value={scannerInput}
                    onChange={(e) => setScannerInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleProcessScanOrSearch(scannerInput);
                      }
                    }}
                    className="w-full h-12 pl-12 pr-4 rounded-2xl border border-slate-200 font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003876]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleProcessScanOrSearch(scannerInput)}
                  className="h-12 px-6 rounded-2xl bg-[#003876] hover:bg-[#F05A22] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{language === "ar" ? "بحث عن البطاقة" : "Search Pass"}</span>
                </button>
              </div>

              {/* Live Phone & Webcam QR Camera Scanner */}
              <div className="pt-2">
                <CameraScannerComponent
                  onScanResult={(decodedText) => {
                    handleProcessScanOrSearch(decodedText);
                  }}
                />
              </div>

              {scannerError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                  {scannerError}
                </div>
              )}
            </div>

            {/* Scanned Student Results & Confirmation Panel */}
            {scannedStudentResult && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 animate-fadeIn">
                
                {/* Result Header & Status Confirmation CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#F05A22] bg-[#F05A22]/10 px-2.5 py-0.5 rounded-full">
                      Référence Pass: {scannedStudentResult.badgeId || "HFT-2026"}
                    </span>
                    <h3 className="text-2xl font-black text-[#003876] mt-1">
                      {scannedStudentResult.firstName} {scannedStudentResult.lastName}
                    </h3>
                  </div>

                  <div>
                    {scannedStudentResult.status === "Confirmé" ? (
                      <span className="px-5 py-3 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>{language === "ar" ? "الدخول مؤكد مسبقاً" : "ENTRY ALREADY VALIDATED & CONFIRMED"}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          handleUpdateStudentStatus(scannedStudentResult.id, "Confirmé");
                          setScannedStudentResult({ ...scannedStudentResult, status: "Confirmé" });
                          setScanConfirmationNotice(
                            (language === "ar" ? `✅ تم تأكيد الدخول : ${scannedStudentResult.firstName} ${scannedStudentResult.lastName} - تم التحقق بنجاح!` : `✅ ENTRY CONFIRMED: ${scannedStudentResult.firstName} ${scannedStudentResult.lastName} - Successfully Checked In!`)
                          );
                        }}
                        className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{language === "ar" ? "تأكيد دخول الطالب" : "CONFIRM STUDENT ENTRY"}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Details & Live Badge Preview */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Student Registration Details */}
                  <div className="md:col-span-6 space-y-4 text-xs font-semibold text-slate-700">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-black uppercase text-[#003876] block">Informations Personnelles</span>
                      <p><span className="text-slate-400 block uppercase text-[10px] font-bold">Email</span> <span className="font-bold text-slate-900">{scannedStudentResult.email}</span></p>
                      <p><span className="text-slate-400 block uppercase text-[10px] font-bold">{language === "ar" ? "الهاتف" : "Phone"}</span> <span className="font-bold text-slate-900">{scannedStudentResult.phone}</span></p>
                      <p><span className="text-slate-400 block uppercase text-[10px] font-bold">Wilaya</span> <span className="font-bold text-slate-900">{scannedStudentResult.wilaya || "Non spécifiée"}</span></p>
                      <p><span className="text-slate-400 block uppercase text-[10px] font-bold">Tranche d'âge</span> <span className="font-bold text-slate-900">{scannedStudentResult.ageCategory}</span></p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-black uppercase text-[#003876] block">Parcours & Profil</span>
                      <p><span className="text-slate-400 block uppercase text-[10px] font-bold">{language === "ar" ? "الوضعية الحالية" : "Current Status"}</span> <span className="font-bold text-[#003876]">{scannedStudentResult.currentStatus}</span></p>
                      <p><span className="text-slate-400 block uppercase text-[10px] font-bold">Domaine</span> <span className="font-bold text-slate-900">{scannedStudentResult.fieldOfStudyOrWork}</span></p>
                      {scannedStudentResult.university && (
                        <p><span className="text-slate-400 block uppercase text-[10px] font-bold">Établissement</span> <span className="font-bold text-slate-900">{scannedStudentResult.university}</span></p>
                      )}
                    </div>

                    {scannedStudentResult.cvUrl && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <span className="text-slate-700 font-bold truncate max-w-[180px]">{scannedStudentResult.cvFileName || "Fichier_CV.pdf"}</span>
                        <a
                          href={scannedStudentResult.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Ouvrir CV PDF</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Live Badge Preview */}
                  <div className="md:col-span-6 flex flex-col items-center justify-center bg-slate-100/60 p-4 rounded-3xl border border-slate-200">
                    <span className="text-xs font-black uppercase text-[#003876] mb-3">{language === "ar" ? "معاينة بطاقة دخول الطالب" : "Student Badge Pass Preview"}</span>
                    <StudentBadge student={scannedStudentResult} showActions={false} />
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* ── LEAD INSPECTION MODAL ── */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-8 space-y-6 shadow-2xl text-start my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#F05A22]">Formulaire PDF 9-Champs</span>
                <h3 className="text-lg sm:text-xl font-black text-[#003876]">{selectedLead.companyName}</h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 rounded-full hover:bg-slate-100">
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">{language === "ar" ? "الممثل" : "Representative"}</span>
                  <span className="text-slate-900 font-bold text-sm">{selectedLead.representativeName}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Fonction</span>
                  <span className="text-slate-900 font-bold text-sm">{selectedLead.role}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Email</span>
                  <span className="text-slate-900 font-bold">{selectedLead.email}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Téléphone</span>
                  <span className="text-slate-900 font-bold">{selectedLead.phone}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">{language === "ar" ? "عدد الممثلين بالجناح" : "Booth Representatives Count"}</span>
                  <span className="text-slate-900 font-bold text-sm">{selectedLead.representativesCount} personnes</span>
                </div>

                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Opportunités proposées (pour réseaux sociaux)</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedLead.opportunities?.map((o) => (
                      <span key={o} className="px-2.5 py-1 rounded-full bg-[#003876] text-white font-bold text-[10px]">
                        {o}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Profils / Spécialités recherchés</span>
                  <p className="text-slate-800 font-medium mt-1">{selectedLead.targetProfiles || "Non spécifié"}</p>
                </div>

                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Matériel prévu pour stand</span>
                  <p className="text-slate-800 font-medium mt-1">{selectedLead.equipmentNeeded || "Non spécifié"}</p>
                </div>

                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Remarques complémentaires</span>
                  <p className="text-slate-800 font-medium mt-1">{selectedLead.remarks || "Aucune remarque"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">Reçu le : {new Date(selectedLead.submittedAt).toLocaleString("fr-FR")}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateLeadStatus(selectedLead.id, "Confirmé")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                  >
                    {language === "ar" ? "اعتماد العارض" : "Approve Exhibitor"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STUDENT INSPECTION MODAL (WITH BADGE & 5-STEP PDF DETAILS) ── */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 space-y-6 shadow-2xl text-start my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-[#F05A22] bg-[#F05A22]/10 px-2.5 py-0.5 rounded-full">
                    Pass Badge: {selectedStudent.badgeId || "HFT-2026"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Reçu le : {new Date(selectedStudent.submittedAt).toLocaleString("fr-FR")}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#003876] mt-1">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 rounded-full hover:bg-slate-100">
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Modal Content Grid: Left side details, Right side Badge */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (7 cols): Full 5-Section Registration Details */}
              <div className="lg:col-span-7 space-y-5 text-xs font-semibold text-slate-700">
                
                {/* 1. Informations Personnelles */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2.5">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[#003876] border-b border-slate-200 pb-1.5">
                    1. Informations Personnelles
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-800">
                    <div><span className="text-slate-400 text-[10px] uppercase block font-bold">Email</span><span className="font-bold">{selectedStudent.email}</span></div>
                    <div><span className="text-slate-400 text-[10px] uppercase block font-bold">Téléphone</span><span className="font-bold">{selectedStudent.phone}</span></div>
                    <div><span className="text-slate-400 text-[10px] uppercase block font-bold">Wilaya</span><span className="font-bold">{selectedStudent.wilaya || "Non spécifiée"}</span></div>
                    <div><span className="text-slate-400 text-[10px] uppercase block font-bold">Tranche d'âge</span><span className="font-bold">{selectedStudent.ageCategory}</span></div>
                  </div>
                </div>

                {/* 2. Parcours Académique et Professionnel */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2.5">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[#003876] border-b border-slate-200 pb-1.5">
                    2. Parcours Académique & Professionnel
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-800">
                    <div><span className="text-slate-400 text-[10px] uppercase block font-bold">Statut Actuel</span><span className="font-bold text-[#003876]">{selectedStudent.currentStatus}</span></div>
                    <div><span className="text-slate-400 text-[10px] uppercase block font-bold">Domaine d'études / travail</span><span className="font-bold">{selectedStudent.fieldOfStudyOrWork || (selectedStudent as any).fieldOfStudy}</span></div>
                    {selectedStudent.university && (
                      <div className="col-span-2"><span className="text-slate-400 text-[10px] uppercase block font-bold">Établissement</span><span className="font-bold">{selectedStudent.university}</span></div>
                    )}
                  </div>
                </div>

                {/* 3. Profil Professionnel (CV PDF) */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2.5">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[#003876] border-b border-slate-200 pb-1.5">
                    3. Profil Professionnel & CV PDF
                  </h4>
                  {selectedStudent.cvUrl ? (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-bold truncate max-w-[200px]">{selectedStudent.cvFileName || "Fichier_CV.pdf"}</span>
                      <a
                        href={selectedStudent.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Ouvrir CV PDF</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">Aucun CV PDF téléversé.</p>
                  )}
                </div>

                {/* 4. Objectifs et Centres d'Intérêt */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[#003876] border-b border-slate-200 pb-1.5">
                    4. Objectifs & Centres d'Intérêt
                  </h4>
                  
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block font-bold mb-1">Objectifs recherchés</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedStudent.seekingObjectives && selectedStudent.seekingObjectives.length > 0 ? (
                        selectedStudent.seekingObjectives.map((obj, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-full bg-[#003876] text-white text-[10px] font-bold">
                            {obj}
                          </span>
                        ))
                      ) : <span className="text-slate-400">Non renseigné</span>}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block font-bold mb-1">Domaines les plus intéressants</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedStudent.interestedFields && selectedStudent.interestedFields.length > 0 ? (
                        selectedStudent.interestedFields.map((fld, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-full bg-[#F05A22]/10 text-[#F05A22] text-[10px] font-bold border border-[#F05A22]/20">
                            {fld}
                          </span>
                        ))
                      ) : <span className="text-slate-400">Non renseigné</span>}
                    </div>
                  </div>
                </div>

                {/* 5. Source et Remarques */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[#003876] border-b border-slate-200 pb-1.5">
                    5. Source & Remarques
                  </h4>
                  <p><span className="text-slate-400 text-[10px] uppercase font-bold block">Canal de découverte</span> {selectedStudent.howDidYouHear || "Non spécifié"}</p>
                  {selectedStudent.additionalComments && (
                    <p className="pt-1"><span className="text-slate-400 text-[10px] uppercase font-bold block">Commentaires</span> {selectedStudent.additionalComments}</p>
                  )}
                </div>

                {/* Status Updater */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Statut :</span>
                    <select
                      value={selectedStudent.status}
                      disabled={isSendingEmail}
                      onChange={(e) => handleUpdateStudentStatus(selectedStudent.id, e.target.value as any)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Nouveau">Nouveau</option>
                      <option value="En cours">En cours</option>
                      <option value="Confirmé">Confirmé</option>
                      <option value="Refusé">Refusé</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    disabled={isSendingEmail}
                    onClick={() => handleResendStudentEmail(selectedStudent.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#003876] font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    {isSendingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#003876]" />
                    ) : (
                      <Mail className="w-4 h-4 text-[#F05A22]" />
                    )}
                    <span>{isSendingEmail ? "Envoi en cours..." : "Renvoyer Badge par Email"}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteStudent(selectedStudent.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{language === "ar" ? "حذف الطالب" : "Delete Student"}</span>
                  </button>
                </div>

              </div>

              {/* Right Column (5 cols): Live Student Lanyard Badge Preview */}
              <div className="lg:col-span-5 bg-slate-100/60 p-4 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs font-black uppercase text-[#003876] tracking-wider">{language === "ar" ? "معاينة بطاقة دخول الطالب" : "Student Badge Pass Preview"}</span>
                  <p className="text-[11px] text-slate-500 font-medium">{language === "ar" ? "مخصصة للدخول والاستقبال بالصالون" : "Generated for event entry and check-in"}</p>
                </div>

                {/* Live Badge Preview Component */}
                <StudentBadge student={selectedStudent} showActions={true} />
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ── ADD/EDIT SPONSOR MODAL (WITH DRAG & DROP LOGO DROPZONE) ── */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-8 space-y-6 shadow-2xl text-start my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg sm:text-xl font-black text-[#003876]">
                {language === "ar" ? (editingSponsor ? "تعديل الراعي / الشركة" : "إضافة راعي / شركة") : (editingSponsor ? "Edit Sponsor / Company" : "Add Sponsor / Company")}
              </h3>
              <button onClick={() => setShowSponsorModal(false)} className="p-2 rounded-full hover:bg-slate-100">
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveSponsor} className="space-y-4 text-xs font-semibold">
              
              {/* Drag & Drop Logo Dropzone in Form */}
              <div>
                <label className="block text-slate-700 font-black mb-1.5">
                  Logo / Image de la marque *
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      const uploadedUrl = await uploadLogoFile(file);
                      if (uploadedUrl) {
                        const inferredName = sponsorForm.name || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").toUpperCase();
                        setSponsorForm((prev) => ({
                          ...prev,
                          logo: uploadedUrl,
                          name: inferredName,
                        }));
                      }
                    }
                  }}
                />

                {/* Dragzone Box */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingModal(true);
                  }}
                  onDragLeave={() => setIsDraggingModal(false)}
                  onDrop={handleModalDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative ${
                    isDraggingModal
                      ? "border-[#F05A22] bg-[#F05A22]/10 scale-102"
                      : sponsorForm.logo
                      ? "border-emerald-300 bg-emerald-50/30 hover:border-emerald-400"
                      : "border-slate-300 hover:border-[#003876] bg-slate-50 hover:bg-white"
                  }`}
                >
                  {isUploadingLogo ? (
                    <div className="flex items-center gap-2 py-4 text-[#003876]">
                      <Loader2 className="w-6 h-6 animate-spin text-[#F05A22]" />
                      <span className="font-bold text-xs">{language === "ar" ? "جاري رفع الصورة..." : "Uploading image..."}</span>
                    </div>
                  ) : sponsorForm.logo ? (
                    <div className="space-y-3 py-1 flex flex-col items-center w-full">
                      <div className="h-28 w-full max-w-xs bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center shadow-xs">
                        <img
                          src={sponsorForm.logo}
                          alt={sponsorForm.name || "Logo sponsor"}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Logo chargé avec succès</span>
                        <span className="text-slate-400 text-[10px]">(Cliquer pour remplacer)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 py-2">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 mx-auto flex items-center justify-center text-[#F05A22] shadow-xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="font-black text-xs text-[#003876]">
                        Glissez et déposez votre image ici
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Ou cliquez pour parcourir les fichiers (PNG, JPG, SVG, WEBP)
                      </p>
                    </div>
                  )}
                </div>

                {/* Manual URL Input Fallback */}
                <div className="mt-2">
                  <span className="text-[10px] text-slate-400 font-medium block mb-1">
                    Ou saisissez manuellement le chemin d'accès au logo :
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ex: /partners/2026/satim.png"
                    value={sponsorForm.logo || ""}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, logo: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#003876]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-black mb-1">Nom de l'entreprise *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: SATIM"
                  value={sponsorForm.name || ""}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003876]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-black mb-1">Édition *</label>
                  <select
                    value={sponsorForm.edition || 2026}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, edition: Number(e.target.value) as any })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003876]"
                  >
                    <option value={2026}>2026 (Édition Actuelle)</option>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-black mb-1">Niveau / Tier Sponsor</label>
                  <select
                    value={sponsorForm.sponsorTier || "silver"}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, sponsorTier: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003876]"
                  >
                    <option value="gold">Gold (Or)</option>
                    <option value="silver">Silver (Argent)</option>
                    <option value="bronze">Bronze</option>
                    <option value="official">Partenaire Officiel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-black mb-1">{language === "ar" ? "الموقع الإلكتروني (اختياري)" : "Website (Optional)"}</label>
                <input
                  type="url"
                  placeholder="https://www.company.dz"
                  value={sponsorForm.website || ""}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, website: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003876]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-black mb-1">{language === "ar" ? "الوصف (الإنجليزية)" : "Description (English)"}</label>
                <textarea
                  rows={3}
                  placeholder={language === "ar" ? "نبذة تعريفية باللغة الإنجليزية..." : "Brief company overview in English..."}
                  value={sponsorForm.description?.en || ""}
                  onChange={(e) =>
                    setSponsorForm({
                      ...sponsorForm,
                      description: { en: e.target.value, ar: sponsorForm.description?.ar || "" },
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003876]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-black mb-1">{language === "ar" ? "الوصف (العربية)" : "Description (Arabic)"}</label>
                <textarea
                  rows={3}
                  dir="rtl"
                  placeholder={language === "ar" ? "نبذة تعريفية باللغة العربية..." : "Brief company overview in Arabic..."}
                  value={sponsorForm.description?.ar || ""}
                  onChange={(e) =>
                    setSponsorForm({
                      ...sponsorForm,
                      description: { en: sponsorForm.description?.en || "", ar: e.target.value },
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003876]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSponsorModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F05A22] text-white font-black hover:bg-[#FFBD0E] hover:text-[#0E1B2C] shadow-md"
                >
                  {language === "ar" ? "حفظ" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
