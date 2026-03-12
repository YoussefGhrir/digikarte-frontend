"use client";

import { IconLogout } from "@/components/icons";
import { useAuth } from "@/lib/auth-context";
import {
  authDeleteMe,
  authGetProfile,
  authUpdateProfile,
  authUpdateProfilePhoto,
  type ProfileDto,
  isApiError,
} from "@/lib/api";
import { errorMessageFromCode, t, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ProfilePage() {
  const { user, token, loading, logout, refreshUser } = useAuth();
  const { locale } = useLanguage();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProfile = useCallback(async () => {
    if (!token) return;
    try {
      const p = await authGetProfile();
      setProfile(p);
      setPrenom(p.prenom ?? "");
      setNom(p.nom ?? "");
      setTelephone(p.telephone ?? "");
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login");
      return;
    }
    if (token) loadProfile();
  }, [loading, token, router, loadProfile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSaveSuccess(false);
    setSaving(true);
    try {
      const updated = await authUpdateProfile({ prenom, nom, telephone });
      setProfile(updated);
      await refreshUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setFormError(isApiError(err) ? errorMessageFromCode(err.code, locale) : (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoError("");
    setPhotoUploading(true);
    try {
      await authUpdateProfilePhoto(file);
      await refreshUser();
      await loadProfile();
    } catch (err) {
      setPhotoError(
        isApiError(err) ? errorMessageFromCode(err.code, locale) : (err as Error).message
      );
    } finally {
      setPhotoUploading(false);
    }
  }

  function handleDeleteAccount() {
    setDeleteError("");
    setDeleting(true);
    authDeleteMe()
      .then(() => logout())
      .catch((err) => {
        setDeleteError(
          isApiError(err) ? errorMessageFromCode(err.code, locale) : t("errorDeleteAccount", locale)
        );
      })
      .finally(() => setDeleting(false));
  }

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          {t("dashboardLoading", locale)}
        </p>
      </div>
    );
  }

  if (!token || !profile) return null;

  const displayPhoto = profile.profilePhotoBase64 ?? user?.profilePhotoBase64;
  const initial = (profile.prenom?.[0] ?? profile.nom?.[0] ?? "?").toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          {t("profileKicker", locale)}
        </p>
        <h1 className="mt-2 font-forum text-3xl tracking-tight text-neutral-50 md:text-4xl">
          {t("profileTitle", locale)}
        </h1>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-8">
        {/* Photo de profil */}
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            {displayPhoto ? (
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-amber-500/40 bg-neutral-800">
                <img
                  src={`data:image/jpeg;base64,${displayPhoto}`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-500/40 bg-neutral-800 text-3xl font-semibold text-amber-300">
                {initial}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handlePhotoChange}
              disabled={photoUploading}
              aria-label={t("profileChangePhoto", locale)}
            />
          </div>
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <p className="text-sm font-medium text-neutral-300">
              {t("profilePhoto", locale)}
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={photoUploading}
              className="cursor-pointer rounded-xl bg-amber-500 px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-amber-400 disabled:opacity-60"
            >
              {photoUploading ? t("dashboardLoading", locale) : t("profileChangePhoto", locale)}
            </button>
            <p className="text-[11px] text-neutral-500">
              {t("profileUploadPhoto", locale)}
            </p>
            {photoError && (
              <p className="text-xs text-red-400">{photoError}</p>
            )}
          </div>
        </div>

        {/* Formulaire nom / prénom / email / téléphone */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-500">
                {t("profileFirstName", locale)}
              </span>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-neutral-100 placeholder:text-neutral-500 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                placeholder="Alex"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-500">
                {t("profileLastName", locale)}
              </span>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-neutral-100 placeholder:text-neutral-500 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                placeholder="Martin"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-500">
              {t("profileEmail", locale)}
            </span>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-neutral-700 bg-neutral-800/50 px-4 py-2.5 text-neutral-400"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-500">
              {t("profilePhone", locale)}
            </span>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-neutral-100 placeholder:text-neutral-500 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
              placeholder="+33 6 00 00 00 00"
            />
          </label>
          {formError && (
            <p className="text-sm text-red-400">{formError}</p>
          )}
          {saveSuccess && (
            <p className="text-sm text-emerald-400">{t("profileSaved", locale)}</p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-400 disabled:opacity-60"
          >
            {saving ? t("profileSaving", locale) : t("profileSave", locale)}
          </button>
        </form>

        {/* Déconnexion et supprimer le compte */}
        <div className="mt-10 border-t border-neutral-800 pt-8 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <button
              type="button"
              onClick={() => logout()}
              className="flex w-full cursor-pointer items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-400 sm:w-auto"
            >
              <IconLogout className="h-4 w-4 shrink-0" />
              {t("profileLogout", locale)}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteAccountModal(true)}
              disabled={deleting}
              className="w-full cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60 sm:w-auto"
            >
              {t("profileDeleteAccount", locale)}
            </button>
          </div>
          {deleteError && (
            <p className="text-sm text-red-400">{deleteError}</p>
          )}
        </div>
      </div>

      {/* Modal confirmation suppression compte */}
      {showDeleteAccountModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => !deleting && setShowDeleteAccountModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-forum text-xl text-neutral-50">
              {t("profileDeleteAccount", locale)}
            </h2>
            <p className="mt-3 text-sm text-neutral-400">
              {t("profileDeleteConfirm", locale)}
            </p>
            {deleteError && (
              <p className="mt-2 text-sm text-red-400">{deleteError}</p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteAccountModal(false)}
                disabled={deleting}
                className="cursor-pointer rounded-xl bg-neutral-600 px-4 py-2 text-sm text-white hover:bg-neutral-500 disabled:opacity-60"
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="cursor-pointer rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
              >
                {deleting ? t("dashboardLoading", locale) : t("profileDeleteAccount", locale)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
