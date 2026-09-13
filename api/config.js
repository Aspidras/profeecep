export default function handler(req,res){
  const url=process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)return res.status(503).json({error:"Cloud config unavailable"});
  res.status(200).json({url,key});
}