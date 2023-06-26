import { atom } from 'jotai';

export const viewerCountAtom = atom(0);
export const handleViewerCountAtom = atom(null, (get, set, update: number) => {
  set(viewerCountAtom, () => update);
});

export const donationModalOpenAtom = atom(false);
export const handleDonationModalOpenAtom = atom(
  null,
  (get, set, update: boolean) => {
    set(donationModalOpenAtom, () => update);
  }
);
