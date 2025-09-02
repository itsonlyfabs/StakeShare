import React, { useState, useEffect } from 'react';
import { Creator } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Edit, Loader2 } from 'lucide-react';

export default function CreatorProfilePage() {
    const [creator, setCreator] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [followers, setFollowers] = useState(0);
    const [platform, setPlatform] = useState('twitter');
    const [socialLinks, setSocialLinks] = useState({
        twitter: '',
        instagram: '',
        youtube: '',
        tiktok: '',
        linkedin: '',
        website: ''
    });

    useEffect(() => {
        const fetchCreatorData = async () => {
            setIsLoading(true);
            try {
                const user = await User.me();
                setEmail(user.email);

                const creatorsByEmail = await Creator.filter({ email: user.email });
                let existingCreator = null;
                if (creatorsByEmail.length > 0) {
                    existingCreator = creatorsByEmail[0];
                } else {
                    const allCreators = await Creator.list();
                    existingCreator = allCreators.find(c => c.email === user.email);
                }

                if (existingCreator) {
                    setCreator(existingCreator);
                    setName(existingCreator.name || '');
                    setBio(existingCreator.bio || '');
                    setFollowers(existingCreator.total_followers || 0);
                    setPlatform(existingCreator.primary_platform || 'twitter');
                    setSocialLinks(existingCreator.social_links || { twitter: '', instagram: '', youtube: '', tiktok: '', linkedin: '', website: '' });
                } else {
                    setName(user.full_name || '');
                    setIsEditing(true);
                }
            } catch (error) {
                console.error("Error loading profile data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCreatorData();
    }, []);

    const handleSave = async () => {
        if (!name.trim()) {
            alert("Display Name is required.");
            return;
        }
        
        setIsSaving(true);
        try {
            const dataToSave = {
                name: name.trim(),
                email: email,
                bio: bio || '',
                total_followers: Number(followers) || 0,
                primary_platform: platform,
                social_links: socialLinks
            };

            if (creator) {
                await Creator.update(creator.id, dataToSave);
            } else {
                const newCreator = await Creator.create(dataToSave);
                setCreator(newCreator);
            }
            
            setIsEditing(false);
            alert("Profile saved successfully!");

        } catch (error) {
            console.error("Save error:", error);
            alert(`Error saving profile: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSocialLinkChange = (platform, value) => {
        setSocialLinks(prev => ({
            ...prev,
            [platform]: value
        }));
    };
    
    const handleCancel = () => {
        if (creator) {
            setName(creator.name || '');
            setBio(creator.bio || '');
            setFollowers(creator.total_followers || 0);
            setPlatform(creator.primary_platform || 'twitter');
            setSocialLinks(creator.social_links || { twitter: '', instagram: '', youtube: '', tiktok: '', linkedin: '', website: '' });
            setIsEditing(false);
        }
    };

    if (isLoading) {
        return <div className="text-center text-white p-12">Loading...</div>;
    }

    const isViewMode = !isEditing && creator;

    const inputClasses = (disabled) => 
        `mt-2 text-base border-white/20 ${disabled ? 'bg-white/10 text-white/70 cursor-not-allowed' : 'bg-white text-slate-900'}`;

    return (
        <div className="p-4 md:p-8 text-white">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    {isViewMode && (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    )}
                </div>

                {!creator && isEditing && (
                     <Alert className="mb-8 bg-green-500/10 border-green-500/30 text-white">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Welcome, Creator!</AlertTitle>
                        <AlertDescription>
                            Complete your profile to start applying for programs.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="glass-card rounded-2xl p-6 md:p-8">
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="name" className="font-bold">Display Name *</Label>
                            <Input id="name" type="text" value={name} onChange={e => setName(e.target.value)} disabled={isViewMode} className={inputClasses(isViewMode)} placeholder="Enter your display name" />
                        </div>

                        <div>
                            <Label htmlFor="email" className="font-bold">Email</Label>
                            <Input id="email" type="email" value={email} disabled className="mt-2 text-base bg-white/10 border-white/30 text-white/70 cursor-not-allowed" />
                        </div>
                        
                        <div>
                            <Label htmlFor="bio" className="font-bold">Bio</Label>
                            <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} disabled={isViewMode} rows={4} className={inputClasses(isViewMode)} placeholder="Tell us about yourself" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="font-bold">Primary Platform</Label>
                                <Select value={platform} onValueChange={setPlatform} disabled={isViewMode}>
                                    <SelectTrigger className={`w-full mt-2 text-base ${inputClasses(isViewMode)}`}>
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent className="glass-card bg-slate-800/90 text-white border-slate-700">
                                        <SelectItem value="twitter">Twitter</SelectItem>
                                        <SelectItem value="instagram">Instagram</SelectItem>
                                        <SelectItem value="youtube">YouTube</SelectItem>
                                        <SelectItem value="tiktok">TikTok</SelectItem>
                                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="followers" className="font-bold">Total Followers</Label>
                                <Input id="followers" type="number" value={followers} onChange={e => setFollowers(e.target.value)} disabled={isViewMode} className={inputClasses(isViewMode)} placeholder="e.g., 10000" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Social Media Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(socialLinks).map(([platformKey, url]) => (
                                    <div key={platformKey}>
                                        <Label htmlFor={`social-${platformKey}`} className="font-bold capitalize">
                                            {platformKey === 'website' ? 'Website' : `${platformKey} Profile`}
                                        </Label>
                                        <Input id={`social-${platformKey}`} type="url" value={url} onChange={e => handleSocialLinkChange(platformKey, e.target.value)} disabled={isViewMode} className={inputClasses(isViewMode)} placeholder={platformKey === 'website' ? 'https://yourwebsite.com' : `https://${platformKey}.com/yourusername`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {!isViewMode && (
                            <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                                {creator && (
                                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                )}
                                <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                                    {isSaving ? 'Saving...' : 'Save Profile'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                 {isViewMode && (
                    <Alert className="mt-8 bg-green-500/10 border-green-500/30 text-white">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Profile Active!</AlertTitle>
                        <AlertDescription>
                            Your profile is saved. You can now browse and apply to programs from the sidebar.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}