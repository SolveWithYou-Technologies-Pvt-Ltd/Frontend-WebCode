import {
  Activity,
  Baby,
  Bone,
  Brain,
  BriefcaseMedical,
  CircleDot,
  Droplets,
  Ear,
  Eye,
  HeartPulse,
  Microscope,
  Pill,
  ScanHeart,
  ShieldPlus,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
} from "lucide-react";

const serviceIcons = {
  Activity,
  Baby,
  Bone,
  Brain,
  BriefcaseMedical,
  CircleDot,
  Droplets,
  Ear,
  Eye,
  HeartPulse,
  Microscope,
  Pill,
  ScanHeart,
  ShieldPlus,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
};

export const getServiceIcon = (iconKey) => {
  return serviceIcons[iconKey] || Stethoscope;
};

export default serviceIcons;
