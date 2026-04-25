import { 
  Repeat2, Heart, UserPlus, Users, MessageSquare, BarChart3, Star, UserCheck 
} from "lucide-react";
import { SERVICES } from "src/config.data";

const iconMap: Record<string, (props: any) => JSX.Element> = {
  "habrcareer.Friends": (p) => <UserCheck {...p} className="text-orange-400" />,
  "github.Followers": (p) => <Users {...p} className="text-green-400" />,
  "github.Stars": (p) => <Star {...p} className="text-yellow-400" />,
  "likesfm.repost": (p) => <Repeat2 {...p} className="text-blue-400" />,
  "likesfm.like": (p) => <Heart {...p} className="text-pink-500" />,
  "likesfm.sub": (p) => <UserPlus {...p} className="text-purple-400" />,
  "likesfm.group": (p) => <Users {...p} className="text-indigo-400" />,
  "likesfm.comment": (p) => <MessageSquare {...p} className="text-slate-400" />,
  "likesfm.poll": (p) => <BarChart3 {...p} className="text-emerald-400" />,
};

export const SUPPORTED_SERVICES = SERVICES.map(service => ({
  ...service,
  modules: service.modules.map(mod => ({
    ...mod,
    renderIcon: iconMap[`${service.id}.${mod.id}`]
  }))
}));
