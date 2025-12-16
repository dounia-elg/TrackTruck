import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateTripPDF = (trip) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      
      doc.fontSize(20).font('Helvetica-Bold').text('ORDRE DE MISSION', { align: 'center' });
      doc.moveDown(2);

      
      doc.fontSize(12).font('Helvetica-Bold').text('Entreprise de Transport Routier');
      doc.fontSize(10).font('Helvetica').text('Adresse: [Votre Adresse]');
      doc.text('Téléphone: [Votre Téléphone]');
      doc.text('Email: [Votre Email]');
      doc.moveDown(2);

     
      doc.fontSize(14).font('Helvetica-Bold').text('DÉTAILS DE LA MISSION');
      doc.moveDown(1);

      doc.fontSize(11).font('Helvetica-Bold').text('Numéro de mission:');
      doc.font('Helvetica').text(`${trip._id}`);
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Chauffeur:');
      doc.font('Helvetica').text(`${trip.chauffeur.name} (${trip.chauffeur.email})`);
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Date et heure de départ:');
      doc.font('Helvetica').text(new Date(trip.dateDepart).toLocaleString('fr-FR'));
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Date et heure d\'arrivée prévue:');
      doc.font('Helvetica').text(new Date(trip.dateArrivee).toLocaleString('fr-FR'));
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Lieu de départ:');
      doc.font('Helvetica').text(trip.lieuDepart);
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Lieu d\'arrivée:');
      doc.font('Helvetica').text(trip.lieuArrivee);
      doc.moveDown(2);

     
      doc.fontSize(14).font('Helvetica-Bold').text('VÉHICULES ASSIGNÉS');
      doc.moveDown(1);

      doc.fontSize(11).font('Helvetica-Bold').text('Camion:');
      doc.font('Helvetica').text(`${trip.camion.immatriculation} - ${trip.camion.modele}`);
      doc.moveDown(0.5);

      if (trip.remorque) {
        doc.font('Helvetica-Bold').text('Remorque:');
        doc.font('Helvetica').text(`${trip.remorque.immatriculation} - ${trip.remorque.type}`);
        doc.moveDown(0.5);
      } else {
        doc.font('Helvetica-Bold').text('Remorque:');
        doc.font('Helvetica').text('Aucune remorque assignée');
        doc.moveDown(0.5);
      }

      doc.moveDown(2);

      
      doc.fontSize(14).font('Helvetica-Bold').text('INSTRUCTIONS');
      doc.moveDown(1);

      doc.fontSize(10).font('Helvetica').text('1. Respecter les horaires de départ et d\'arrivée.');
      doc.text('2. Effectuer les contrôles de sécurité avant le départ.');
      doc.text('3. Maintenir une conduite prudente et respectueuse du code de la route.');
      doc.text('4. Signaler tout incident ou retard immédiatement.');
      doc.text('5. Noter le kilométrage de départ et d\'arrivée.');
      doc.text('6. Vérifier le niveau de carburant.');
      doc.moveDown(2);

      
      doc.fontSize(14).font('Helvetica-Bold').text('SIGNATURES');
      doc.moveDown(1);

   
      const signatureY = doc.y;
      doc.fontSize(10).font('Helvetica-Bold').text('Chauffeur:', 50, signatureY);
      doc.text('Responsable:', 300, signatureY);

     
      doc.moveTo(50, signatureY + 15).lineTo(200, signatureY + 15).stroke();
      doc.moveTo(300, signatureY + 15).lineTo(450, signatureY + 15).stroke();

      doc.moveDown(2);
      doc.fontSize(10).font('Helvetica').text(`Document généré le ${new Date().toLocaleString('fr-FR')}`, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
